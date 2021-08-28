"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nftbot = void 0;
var logging_1 = require("./logging");
var bignumber_js_1 = require("bignumber.js");
function getSellOrder(token_id, orders) {
    var _a;
    var foundOrder;
    for (var ordersKey in orders) {
        var order = orders[ordersKey];
        if (order === null || order.currentPrice === undefined) {
            continue;
        }
        if (((_a = order.asset) === null || _a === void 0 ? void 0 : _a.tokenId) != token_id) {
            continue;
        }
        if (foundOrder === undefined) {
            foundOrder = order;
            continue;
        }
        // @ts-ignore
        if (order.currentPrice < foundOrder.currentPrice) {
            foundOrder = order;
        }
    }
    return foundOrder;
}
/*
 * Start watching the listings based on collection,
 * set max ether price
 * set gas limit = wei (tx cost) * gas amount for transaction price
 * set max wei
 * When an asset is found, buy it immediately
 *
 * ganache, local mainnet
 * */
var Nftbot = /** @class */ (function () {
    function Nftbot(searcher, market, collection, ethLimit, gasLimit, //total amount of gas used for tx
    dryRun) {
        this.searcher = searcher;
        this.market = market;
        this.collection = collection;
        this.ethLimit = ethLimit;
        this.gasLimit = gasLimit;
        this.dryRun = dryRun;
        this.pageOffset = 0;
        this.pageLimit = 50; //this is the cap
    }
    Nftbot.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var run, gas, _a, results, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        run = true;
                        logging_1.logger.info("NFTBot starting.");
                        _b.label = 1;
                    case 1:
                        if (!run) return [3 /*break*/, 12];
                        //gas limiter
                        //this silly thing (the + sign) converts the string to a number
                        logging_1.logger.info("Retrieving gas");
                        _a = bignumber_js_1.BigNumber.bind;
                        return [4 /*yield*/, this.market.getGas()];
                    case 2:
                        gas = new (_a.apply(bignumber_js_1.BigNumber, [void 0, _b.sent()]))();
                        if (!(this.gasLimit.comparedTo(gas) === -1 || gas.eq(-1))) return [3 /*break*/, 4];
                        logging_1.logger.info("Gas too high or unavailable: " + gas);
                        return [4 /*yield*/, delay(2000)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 1];
                    case 4:
                        logging_1.logger.info("Gas is acceptable at: " + gas.toNumber());
                        results = void 0;
                        _b.label = 5;
                    case 5:
                        _b.trys.push([5, 7, , 9]);
                        return [4 /*yield*/, this.searcher.Check(this.collection, "created", this.pageOffset, this.pageLimit)];
                    case 6:
                        results = _b.sent();
                        return [3 /*break*/, 9];
                    case 7:
                        err_1 = _b.sent();
                        logging_1.logger.error(err_1);
                        //todo: should this timer backoff?
                        return [4 /*yield*/, delay(500)];
                    case 8:
                        //todo: should this timer backoff?
                        _b.sent();
                        return [3 /*break*/, 1];
                    case 9:
                        logging_1.logger.info({
                            message: "Found search results for collection",
                            count: results.asset_events.length,
                            collection: this.collection,
                        });
                        //now run each of the assets through the rules to determine if we should buy
                        return [4 /*yield*/, this.handleResults(results, gas)];
                    case 10:
                        //now run each of the assets through the rules to determine if we should buy
                        _b.sent();
                        this.pageOffset += this.pageLimit;
                        //if the collection was empty, or is less than 50 items, then we are at the end of the results
                        if (results.asset_events.length < 50) {
                            this.pageOffset = 0;
                        }
                        //todo: it would be smarter to check how long ago the last refresh was, and if over 500ms just start immediately
                        return [4 /*yield*/, delay(500)];
                    case 11:
                        //todo: it would be smarter to check how long ago the last refresh was, and if over 500ms just start immediately
                        _b.sent();
                        return [3 /*break*/, 1];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    Nftbot.prototype.handleResults = function (results, gas) {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_1, this_1, _a, _b, _i, e;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _loop_1 = function (e) {
                            var event_1, orders, error_1, sellOrder, buy;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0: return [4 /*yield*/, delay(700)];
                                    case 1:
                                        _d.sent();
                                        event_1 = results.asset_events[e];
                                        orders = void 0;
                                        _d.label = 2;
                                    case 2:
                                        _d.trys.push([2, 4, , 5]);
                                        return [4 /*yield*/, this_1.market.getOrders(event_1.contract_address, event_1.asset.token_id)];
                                    case 3:
                                        //todo: there is an optimization here where we can get orders for 30 different token_ids per request
                                        orders = _d.sent();
                                        return [3 /*break*/, 5];
                                    case 4:
                                        error_1 = _d.sent();
                                        //todo: detect if this error is a throttled response and handle appropriately
                                        logging_1.logger.error(error_1);
                                        return [2 /*return*/, "continue"];
                                    case 5:
                                        sellOrder = getSellOrder(event_1.asset.token_id, orders);
                                        if (sellOrder === undefined) {
                                            logging_1.logger.info("Sell order not found or undefined for asset: " + event_1.asset.token_id);
                                            return [2 /*return*/, "continue"];
                                        }
                                        buy = this_1.shouldBuy(event_1, gas, sellOrder);
                                        if (!buy) {
                                            return [2 /*return*/, "continue"];
                                        }
                                        logging_1.logger.info({
                                            message: "Found an order worth buying",
                                            token_id: event_1.asset.token_id,
                                            worth: sellOrder.currentPrice,
                                        });
                                        this_1.market
                                            .buyAsset(event_1.asset.asset_contract.address, event_1.asset.token_id, sellOrder.currentPrice, this_1.dryRun)
                                            .then(function (response) {
                                            var _a;
                                            logging_1.logger.info("item bought successfully", (_a = response.asset) === null || _a === void 0 ? void 0 : _a.name);
                                        })
                                            .catch(function (error) {
                                            logging_1.logger.error("tried to buy item, but failed", event_1.asset.token_id, error);
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a = [];
                        for (_b in results.asset_events)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        e = _a[_i];
                        return [5 /*yield**/, _loop_1(e)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //TODO: this might be a rules engine in the future
    Nftbot.prototype.shouldBuy = function (event, gas, order) {
        if (order.currentPrice === undefined) {
            logging_1.logger.info("Sell price not found or undefined for order");
            return false;
        }
        //is the eth cost acceptable?
        return order.currentPrice <= this.ethLimit;
    };
    return Nftbot;
}());
exports.Nftbot = Nftbot;
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
//# sourceMappingURL=nftbot.js.map