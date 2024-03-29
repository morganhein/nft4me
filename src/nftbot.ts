import { IOpenSeaSearch, SearchResults, MarketEvent } from "./searcher";
import { IBlockMarket } from "./market";
import { OpenSeaAsset, Order } from "opensea-js/lib/types";
import { logger } from "./logging";
import { BigNumber } from "bignumber.js";

function getSellOrder(token_id: string, orders: Order[]): Order | undefined {
  let foundOrder: Order | undefined;
  for (const ordersKey in orders) {
    const order: Order = orders[ordersKey];
    if (order === null || order.currentPrice === undefined) {
      continue;
    }
    if (order.asset?.tokenId != token_id) {
      continue;
    }
    if (foundOrder === undefined) {
      foundOrder = order;
      continue;
    }
    // @ts-ignore
    if (order.currentPrice < foundOrder.currentPrice) {
      foundOrder = order;
    }
  }
  return foundOrder;
}

/*
 * Start watching the listings based on collection,
 * set max ether price
 * set gas limit = wei (tx cost) * gas amount for transaction price
 * set max wei
 * When an asset is found, buy it immediately
 *
 * ganache, local mainnet
 * */

export class Nftbot {
  private pageOffset: number = 0;
  private pageLimit: number = 50; //this is the cap
  constructor(
    private searcher: IOpenSeaSearch,
    private market: IBlockMarket,
    private collection: string,
    private ethLimit: BigNumber,
    private gasLimit: BigNumber, //total amount of gas used for tx
    private dryRun: boolean
  ) {}
  async start() {
    let run: boolean = true;
    logger.info("NFTBot starting.");
    while (run) {
      //gas limiter
      //this silly thing (the + sign) converts the string to a number
      logger.info("Retrieving gas");
      const gas: BigNumber = new BigNumber(await this.market.getGas());
      if (this.gasLimit.comparedTo(gas) === -1 || gas.eq(-1)) {
        logger.info("Gas too high or unavailable: " + gas);
        await delay(2000);
        continue;
      }
      logger.info("Gas is acceptable at: " + gas.toNumber());
      //paginate through searcher results.. it would be awesome if this could be async so that it can be run in parallel
      //for each asset, run it through a set of rules to determine what to do with it
      //buy, and notify!
      let results: SearchResults;
      try {
        results = await this.searcher.Check(
          this.collection,
          "created",
          this.pageOffset,
          this.pageLimit
        );
      } catch (err) {
        logger.error(err);
        //todo: should this timer backoff?
        await delay(500);
        continue;
      }
      logger.info({
        message: "Found search results for collection",
        count: results.asset_events.length,
        collection: this.collection,
      });
      //now run each of the assets through the rules to determine if we should buy
      await this.handleResults(results, gas);
      this.pageOffset += this.pageLimit;

      //if the collection was empty, or is less than 50 items, then we are at the end of the results
      if (results.asset_events.length < 50) {
        this.pageOffset = 0;
      }

      //todo: it would be smarter to check how long ago the last refresh was, and if over 500ms just start immediately
      await delay(500);
    }
  }
  async handleResults(results: SearchResults, gas: BigNumber) {
    for (const e in results.asset_events) {
      await delay(700);
      const event = results.asset_events[e];
      //todo: @aaron is the contract address here correct?
      let orders: Order[];
      try {
        //todo: there is an optimization here where we can get orders for 30 different token_ids per request
        orders = await this.market.getOrders(
          event.contract_address,
          event.asset.token_id
        );
      } catch (error) {
        //todo: detect if this error is a throttled response and handle appropriately
        logger.error(error);
        continue;
      }

      const sellOrder = getSellOrder(event.asset.token_id, orders);
      if (sellOrder === undefined) {
        logger.info(
          "Sell order not found or undefined for asset: " + event.asset.token_id
        );
        continue;
      }
      const buy = this.shouldBuy(event, gas, sellOrder);
      if (!buy) {
        continue;
      }
      logger.info({
        message: "Found an order worth buying",
        token_id: event.asset.token_id,
        worth: sellOrder.currentPrice,
      });
      this.market
        .buyAsset(
          event.asset.asset_contract.address,
          event.asset.token_id,
          sellOrder.currentPrice as BigNumber,
          this.dryRun
        )
        .then((response) => {
          logger.info("item bought successfully", response.asset?.name);
        })
        .catch((error) => {
          logger.error(
            "tried to buy item, but failed",
            event.asset.token_id,
            error
          );
        });
    }
  }
  //TODO: this might be a rules engine in the future
  shouldBuy(event: MarketEvent, gas: BigNumber, order: Order): boolean {
    if (order.currentPrice === undefined) {
      logger.info("Sell price not found or undefined for order");
      return false;
    }
    //is the eth cost acceptable?
    return order.currentPrice <= this.ethLimit;
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
