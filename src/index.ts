import { Nftbot } from "./nftbot";
import { HTTPRetriever, IOpenSeaSearch } from "./searcher";
import { Web3Market, IBlockMarket } from "./market";

function main() {
  //TODO: need to grab/parse invocation arguments
  const collection: string = "weape24";
  const gasLimit: number = 3;
  const weiLimit: number = 1;
  const ethLimit: number = 0.02;
  let searcher: IOpenSeaSearch = new HTTPRetriever(
    "https://api.opensea.io/api/v1/events"
  );
  let market: IBlockMarket = new Web3Market(
    "https://mainnet.infura.io",
    "TODO: Add wallet"
  );
  let nftBot = new Nftbot(searcher, market, collection, ethLimit, gasLimit);
  nftBot.start();
}

main();

// 311,309,427,143
