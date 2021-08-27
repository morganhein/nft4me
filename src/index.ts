import { ENV } from "./config";
import { Nftbot } from "./nftbot";
import { HTTPRetriever, IOpenSeaSearch } from "./searcher";
import { Web3Market, IBlockMarket } from "./market";

function main() {
  const collection: string = "weape24";
  let searcher: IOpenSeaSearch = new HTTPRetriever(ENV.OpenSeaHTTPAPI);
  let market: IBlockMarket = new Web3Market(ENV.MarketHost, ENV.SourceWallet);
  let nftBot = new Nftbot(
    searcher,
    market,
    collection,
    +ENV.EthLimit,
    +ENV.GasLimit
  );
  nftBot.start();
}

main();
