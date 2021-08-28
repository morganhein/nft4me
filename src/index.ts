import { Config } from "./config";
import { Nftbot } from "./nftbot";
import { HTTPRetriever, IOpenSeaSearch } from "./searcher";
import { Web3Market, IBlockMarket, HTTPMarket } from "./market";
import { logger } from "./logging";
import { BigNumber } from "bignumber.js";

async function main() {
  let c = Config("live");
  logger.info(c);
  let searcher: IOpenSeaSearch = new HTTPRetriever(c.OpenSeaAPI);
  let market: IBlockMarket;
  if (c.Mnemonic.length === 0) {
    //we don't have a mnemonic, so just use http market
    market = new HTTPMarket(c);
  } else {
    //we have a mnemonic, so try to login
    market = new Web3Market(c);
  }
  let nftBot = new Nftbot(
    searcher,
    market,
    c.Collection,
    new BigNumber(c.EthLimit),
    new BigNumber(c.GasLimit),
    c.DryRun
  );
  await nftBot.start();
}

main().then(() => {
  logger.info("finished running");
});
