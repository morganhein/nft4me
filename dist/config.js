"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
var dotenv = __importStar(require("dotenv"));
var yargs_1 = __importDefault(require("yargs/yargs"));
var logging_1 = require("./logging");
dotenv.config();
function Config(environment) {
    var env = {
        SourceWallet: "",
        GasLimit: process.env.GAS_LIMIT,
        EthLimit: process.env.ETH_LIMIT,
        NetworkName: process.env.NETWORK,
        NetworkURI: "",
        OpenSeaAPIKey: process.env.OPEN_SEA_API_KEY,
        OpenSeaAPI: process.env.OPEN_SEA_API,
        InfuraKey: process.env.INFURA_KEY,
        Collection: "",
        DryRun: false,
        Mnemonic: process.env.MNEMONIC,
    };
    var isInfura = !!env.InfuraKey;
    var networkName = env.NetworkName === "mainnet" || env.NetworkName === "live"
        ? "mainnet"
        : "rinkeby";
    var NetworkAPIKey = process.env.INFURA_KEY || process.env.ALCHEMY_KEY;
    env.NetworkURI = isInfura
        ? "https://" + networkName + ".infura.io/v3/" + NetworkAPIKey
        : "https://eth-" + networkName + ".alchemyapi.io/v2/" + NetworkAPIKey;
    if (environment === "tests") {
        //todo: maybe add some test collection/source-wallet stuff?
        return env;
    }
    env.SourceWallet = process.env.SOURCE_WALLET;
    var argv = yargs_1.default(process.argv.slice(2))
        .options({
        collection: { type: "string", demandOption: true },
        wallet: { type: "string" },
        dryrun: { type: "boolean", default: false },
    })
        .parseSync();
    if (argv.wallet) {
        env.SourceWallet = argv.wallet;
    }
    if (argv.collection) {
        env.Collection = argv.collection;
    }
    if (argv.dryrun) {
        logging_1.logger.info("dryrun enabled");
        env.DryRun = argv.dryrun;
    }
    return env;
}
exports.Config = Config;
//# sourceMappingURL=config.js.map