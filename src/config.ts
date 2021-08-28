import * as dotenv from "dotenv";
import yargs from "yargs/yargs";
import { logger } from "./logging";

dotenv.config();

export interface IConfig {
  SourceWallet: string;
  GasLimit: string;
  EthLimit: string;
  MarketHost: string;
  OpenSeaHTTPAPI: string;
  Collection: string;
  DryRun: boolean;
}

export function Config(environment: string): IConfig {
  let env = {
    GasLimit: process.env.GAS_LIMIT as string,
    EthLimit: process.env.ETH_LIMIT as string,
    MarketHost: process.env.MARKET_HOST as string,
    OpenSeaHTTPAPI: process.env.OPEN_SEA_API as string,
    DryRun: false,
    SourceWallet: "",
    Collection: "",
  };
  if (environment === "tests") {
    //todo: maybe add some test collection/source-wallet stuff?
    return env;
  }

  env.SourceWallet = process.env.SOURCE_WALLET as string;

  const argv = yargs(process.argv.slice(2))
    .options({
      collection: { type: "string", demandOption: true },
      wallet: { type: "string" },
      dryrun: { type: "boolean", default: false },
    })
    .parseSync();

  if (argv.wallet) {
    env.SourceWallet = argv.wallet as string;
  }

  if (argv.collection) {
    env.Collection = argv.collection as string;
  }

  if (argv.dryrun) {
    logger.info("dryrun enabled");
    env.DryRun = argv.dryrun as boolean;
  }
  return env;
}
