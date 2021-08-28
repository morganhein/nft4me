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
    private gasLimit: BigNumber //total amount of gas used for tx
  ) {}
  async start() {
    let run: boolean = true;
    while (run) {
      //gas limiter
      //this silly thing (the + sign) converts the string to a number
      const gas: BigNumber = new BigNumber(await this.market.getGas());
      if (gas > this.gasLimit || gas.eq("-1")) {
        await delay(500);
        continue;
      }
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
      const event = results.asset_events[e];
      //todo: get the orders for this collection
      //todo: @aaron is the contract address here correct?
      let orders: Order[] = await this.market.getOrders(
        event.contract_address,
        event.asset.asset_contract.address
      );
      const sellOrder = getSellOrder(event.asset.token_id, orders);
      if (sellOrder === undefined) {
        logger.info(
          "Sell order not found or undefined for asset",
          event.asset.token_id
        );
        continue;
      }
      const buy = this.shouldBuy(event, gas, sellOrder);
      if (!buy) {
        continue;
      }
      this.market
        .buyAsset(
          event.asset.token_id,
          event.asset.asset_contract.address,
          sellOrder.currentPrice as BigNumber
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
