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
exports.ENV = void 0;
var dotenv = __importStar(require("dotenv"));
var yargs_1 = __importDefault(require("yargs/yargs"));
dotenv.config();
exports.ENV = {
    SourceWallet: process.env.SOURCE_WALLET,
    GasLimit: process.env.GAS_LIMIT,
    EthLimit: process.env.ETH_LIMIT,
    MarketHost: process.env.MARKET_HOST,
    OpenSeaHTTPAPI: process.env.OPEN_SEA_API,
    Collection: "",
};
var argv = yargs_1.default(process.argv.slice(2))
    .options({
    COLLECTION: { type: "string", demandOption: true },
    WALLET: { type: "string" },
})
    .parseSync();
if (argv.wallet) {
    exports.ENV.SourceWallet = argv.wallet;
}
if (argv.collection) {
    exports.ENV.Collection = argv.collection;
}
//# sourceMappingURL=config.js.map