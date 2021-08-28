import { Config } from "./config";
import { Nftbot } from "./nftbot";
import { HTTPRetriever, IOpenSeaSearch } from "./searcher";
import { Web3Market, IBlockMarket } from "./market";
import { logger } from "./logging";
import { BigNumber } from "bignumber.js";

async function main() {
  let c = Config("live");
  let searcher: IOpenSeaSearch = new HTTPRetriever(c.OpenSeaHTTPAPI);
  let market: IBlockMarket = new Web3Market(c.MarketHost, c.SourceWallet);
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
