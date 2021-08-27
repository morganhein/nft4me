import { IOpenSeaSearch, SearchResults, MarketEvent } from "./searcher";
import { IBlockMarket } from "./market";
import { OpenSeaAsset } from "opensea-js/lib/types";

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
    private ethLimit: number,
    private gasLimit: number, //total amount of gas used for tx
  ) {}
  async start() {
    let run: boolean = true;
    while (run) {
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
        console.log(err);
        //todo: should this timer backoff?
        await delay(500);
        continue;
      }
      //this silly thing (the + sign) converts the string to a number
      const gas: number = +(await this.market.getGas());
      if (this.)
      //now run each of the assets through the rules to determine if we should buy
      this.handleResults(results, gas);
      this.pageOffset += this.pageLimit;

      //if the collection was empty, or is less than 50 items, then we are at the end of the results
      if (results.asset_events.length < 50) {
        this.pageOffset = 0;
      }

      //todo: it would be smarter to check how long ago the last refresh was, and if over 500ms just start immediately
      await delay(500);
    }
  }
  handleResults(results: SearchResults, gas: number) {
    for (const e in results.asset_events) {
      const event = results.asset_events[e];
      //todo: we can early return here if the gas price in general is too high
      const buy = this.shouldBuy(event, gas);
      if (!buy) {
        continue;
      }
      this.market
        .buyAsset(event.asset.token_id, event.asset.asset_contract.address)
        .then((response) => {
          //todo: better logging, maybe send to discord or something
          console.log("item bought successfully", response.name);
        })
        .catch((error) => {
          console.log(
            "tried to buy item, but failed",
            event.asset.token_id,
            error
          );
        });
    }
  }
  //TODO: this might be a rules engine in the future
  shouldBuy(event: MarketEvent, gas: number): boolean {
    //is the eth cost acceptable?
    const starting_price: number = +event.starting_price;
    if (starting_price > this.ethLimit) {
      return false;
    }
    //check if gwei price matches
    if (event.asset.asset_contract.buyer_fee_basis_points > this.gasLimit) {
      return false;
    }
    return false;
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
