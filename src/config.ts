import * as dotenv from "dotenv";

dotenv.config();

export const ENV = {
  SourceWallet: process.env.SOURCE_WALLET as string,
  GasLimit: process.env.GAS_LIMIT as string,
  EthLimit: process.env.ETH_LIMIT as string,
  MarketHost: process.env.MARKET_HOST as string,
  OpenSeaHTTPAPI: process.env.OPEN_SEA_API as string,
};
