import * as dotenv from "dotenv";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

dotenv.config();

export var ENV = {
  SourceWallet: process.env.SOURCE_WALLET as string,
  GasLimit: process.env.GAS_LIMIT as string,
  EthLimit: process.env.ETH_LIMIT as string,
  MarketHost: process.env.MARKET_HOST as string,
  OpenSeaHTTPAPI: process.env.OPEN_SEA_API as string,
  Collection: "",
};

const argv = yargs(process.argv.slice(2))
  .options({
    COLLECTION: { type: "string", demandOption: true },
    WALLET: { type: "string" },
  })
  .parseSync();

if (argv.wallet) {
  ENV.SourceWallet = argv.wallet as string;
}

if (argv.collection) {
  ENV.Collection = argv.collection as string;
}
