"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPMarket = exports.Web3Market = exports.Market = void 0;
var opensea_js_1 = require("opensea-js");
var web3_1 = __importDefault(require("web3"));
var types_1 = require("opensea-js/lib/types");
var logging_1 = require("./logging");
var subproviders_1 = require("@0x/subproviders");
var Market = /** @class */ (function () {
    function Market(config) {
        this.config = config;
        this.config = config;
        this.network = config.NetworkURI;
    }
    Market.prototype.buyAsset = function (tokenAddress, tokenId, amount, dryRun) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var buyOrder, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (dryRun) {
                                        logging_1.logger.info("Dryrun enabled, would have bought", tokenId);
                                        resolve({});
                                        return [2 /*return*/];
                                    }
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, this.seaport.createBuyOrder({
                                            asset: {
                                                tokenId: tokenId,
                                                tokenAddress: tokenAddress,
                                            },
                                            accountAddress: this.config.SourceWallet,
                                            startAmount: amount.toNumber(),
                                            quantity: 1,
                                            // expirationTime: "",
                                        })];
                                case 2:
                                    buyOrder = _a.sent();
                                    resolve(buyOrder);
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_1 = _a.sent();
                                    logging_1.logger.error("error buying asset", error_1);
                                    reject(error_1);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    // let tokenAddress: string = res.body.Asset.Asset_Contract.address;
    // let tokenId: number = res.body.Asset.token_id;
    Market.prototype.getAsset = function (tokenAddress, tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var asset, err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, this.seaport.api.getAsset({
                                            tokenAddress: tokenAddress,
                                            tokenId: tokenId,
                                        })];
                                case 1:
                                    asset = _a.sent();
                                    resolve(asset);
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_1 = _a.sent();
                                    reject(err_1);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    Market.prototype.getGas = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.w3.eth.getGasPrice()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        logging_1.logger.error(error_2);
                        //return -1 here so we don't accidentally buy tons of shit when the gas price is above 200 but this query failed
                        return [2 /*return*/, "-1"];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Market.prototype.getOrders = function (contractAddress, token_id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var orders, error_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    logging_1.logger.info({
                                        message: "retrieving orders",
                                        token_id: token_id,
                                        asset_contract_address: contractAddress,
                                    });
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, this.seaport.api.getOrders({
                                            asset_contract_address: contractAddress,
                                            token_id: token_id,
                                            side: types_1.OrderSide.Sell,
                                        })];
                                case 2:
                                    orders = _a.sent();
                                    if (orders.count == 0) {
                                        reject("no orders found at that address");
                                    }
                                    if (orders.count != orders.orders.length) {
                                        reject("incorrect amount of orders returned, expected " +
                                            orders.count +
                                            " but found " +
                                            orders.orders.length);
                                    }
                                    resolve(orders.orders);
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_3 = _a.sent();
                                    logging_1.logger.error("error retrieving orders", error_3);
                                    reject(error_3);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    return Market;
}());
exports.Market = Market;
var Web3Market = /** @class */ (function (_super) {
    __extends(Web3Market, _super);
    function Web3Market(config) {
        var _this = _super.call(this, config) || this;
        var BASE_DERIVATION_PATH = "44'/60'/0'/0";
        var mnemonicWalletSubprovider = new subproviders_1.MnemonicWalletSubprovider({
            mnemonic: config.Mnemonic,
            baseDerivationPath: BASE_DERIVATION_PATH,
        });
        var infuraRpcSubprovider = new subproviders_1.RPCSubprovider(_this.network);
        var providerEngine = new subproviders_1.Web3ProviderEngine();
        providerEngine.addProvider(mnemonicWalletSubprovider);
        providerEngine.addProvider(infuraRpcSubprovider);
        providerEngine.addProvider(new web3_1.default.providers.HttpProvider(_this.network));
        providerEngine.start();
        //
        // this.seaport = new OpenSeaPort(
        //   providerEngine,
        //   {
        //     networkName:
        //       config.NetworkName === "mainnet" || config.NetworkName === "live"
        //         ? Network.Main
        //         : Network.Rinkeby,
        //     apiKey: config.OpenSeaAPIKey,
        //   },
        //   (arg) => console.log(arg)
        // );
        _this.w3 = new web3_1.default(new web3_1.default.providers.HttpProvider(_this.network));
        return _this;
    }
    return Web3Market;
}(Market));
exports.Web3Market = Web3Market;
var HTTPMarket = /** @class */ (function (_super) {
    __extends(HTTPMarket, _super);
    function HTTPMarket(config) {
        var _this = _super.call(this, config) || this;
        var provider = new web3_1.default.providers.HttpProvider(_this.network);
        _this.seaport = new opensea_js_1.OpenSeaPort(provider, {
            networkName: opensea_js_1.Network.Main,
        });
        _this.w3 = new web3_1.default(provider);
        return _this;
    }
    return HTTPMarket;
}(Market));
exports.HTTPMarket = HTTPMarket;
//# sourceMappingURL=market.js.map