import { Config } from "./config";
import { Nftbot } from "./nftbot";
import { HTTPRetriever, IOpenSeaSearch } from "./searcher";
import { Web3Market, IBlockMarket } from "./market";

async function main() {
  let c = Config("live");
  let searcher: IOpenSeaSearch = new HTTPRetriever(c.OpenSeaHTTPAPI);
  let market: IBlockMarket = new Web3Market(c.MarketHost, c.SourceWallet);
  let nftBot = new Nftbot(
    searcher,
    market,
    c.Collection,
    +c.EthLimit,
    +c.GasLimit
  );
  await nftBot.start();
}

main().then(() => {
  console.log("finished running");
});
