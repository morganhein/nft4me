import * as dotenv from "dotenv";
import yargs from "yargs/yargs";
import { logger } from "./logging";

dotenv.config();

export interface IConfig {
  SourceWallet: string;
  GasLimit: string;
  EthLimit: string;
  NetworkName: string;
  NetworkURI: string;
  OpenSeaAPI: string;
  OpenSeaAPIKey: string;
  InfuraKey: string;
  Collection: string;
  DryRun: boolean;
  Mnemonic: string;
}

export function Config(environment: string): IConfig {
  let env = {
    SourceWallet: "",
    GasLimit: process.env.GAS_LIMIT as string,
    EthLimit: process.env.ETH_LIMIT as string,
    NetworkName: process.env.Network as string,
    NetworkURI: "",
    OpenSeaAPIKey: process.env.OPEN_SEA_API_KEY as string,
    OpenSeaAPI: process.env.OPEN_SEA_API as string,
    InfuraKey: process.env.INFURA_KEY as string,
    Collection: "",
    DryRun: false,
    Mnemonic: process.env.MNEMONIC as string,
  };
  const isInfura = !!env.InfuraKey;
  const networkName =
    env.NetworkName === "mainnet" || env.NetworkName === "live"
      ? "mainnet"
      : "rinkeby";

  const NetworkAPIKey = process.env.INFURA_KEY || process.env.ALCHEMY_KEY;

  env.NetworkURI = isInfura
    ? "https://" + networkName + ".infura.io/v3/" + NetworkAPIKey
    : "https://eth-" + networkName + ".alchemyapi.io/v2/" + NetworkAPIKey;

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
