import * as dotenv from "dotenv";
import { Nftbot } from "./nftbot";
import { HTTPRetriever, IOpenSeaSearch } from "./searcher";
import { Web3Market, IBlockMarket } from "./market";

dotenv.config();
const SourceWallet = process.env.SOURCE_WALLET as string;
const GasLimit = process.env.GAS_LIMIT as string;
const EthLimit = process.env.ETH_LIMIT as string;
const MarketHost = process.env.MARKET_HOST as string;
const OpenSeaHTTPAPI = process.env.OPEN_SEA_API as string;

function main() {
  const collection: string = "weape24";
  let searcher: IOpenSeaSearch = new HTTPRetriever(OpenSeaHTTPAPI);
  let market: IBlockMarket = new Web3Market(MarketHost, SourceWallet);
  let nftBot = new Nftbot(searcher, market, collection, +EthLimit, +GasLimit);
  nftBot.start();
}

main();
