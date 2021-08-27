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
    function Nftbot(searcher, market, collection, ethLimit, gasLimit //total amount of gas used for tx
    ) {
        this.searcher = searcher;
        this.market = market;
        this.collection = collection;
        this.ethLimit = ethLimit;
        this.gasLimit = gasLimit;
        this.pageOffset = 0;
        this.pageLimit = 50; //this is the cap
    }
    Nftbot.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var run, gas, results, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        run = true;
                        _a.label = 1;
                    case 1:
                        if (!run) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.market.getGas()];
                    case 2:
                        gas = +(_a.sent());
                        if (!(gas > this.gasLimit || gas === -1)) return [3 /*break*/, 4];
                        return [4 /*yield*/, delay(500)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 4:
                        results = void 0;
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 9]);
                        return [4 /*yield*/, this.searcher.Check(this.collection, "created", this.pageOffset, this.pageLimit)];
                    case 6:
                        results = _a.sent();
                        return [3 /*break*/, 9];
                    case 7:
                        err_1 = _a.sent();
                        console.log(err_1);
                        //todo: should this timer backoff?
                        return [4 /*yield*/, delay(500)];
                    case 8:
                        //todo: should this timer backoff?
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 9: 
                    //now run each of the assets through the rules to determine if we should buy
                    return [4 /*yield*/, this.handleResults(results, gas)];
                    case 10:
                        //now run each of the assets through the rules to determine if we should buy
                        _a.sent();
                        this.pageOffset += this.pageLimit;
                        //if the collection was empty, or is less than 50 items, then we are at the end of the results
                        if (results.asset_events.length < 50) {
                            this.pageOffset = 0;
                        }
                        //todo: it would be smarter to check how long ago the last refresh was, and if over 500ms just start immediately
                        return [4 /*yield*/, delay(500)];
                    case 11:
                        //todo: it would be smarter to check how long ago the last refresh was, and if over 500ms just start immediately
                        _a.sent();
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
                            var event_1, orders, buy;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        event_1 = results.asset_events[e];
                                        return [4 /*yield*/, this_1.market.getOrders(event_1.contract_address, event_1.asset.asset_contract.address)];
                                    case 1:
                                        orders = _d.sent();
                                        buy = this_1.shouldBuy(event_1, gas, orders);
                                        if (!buy) {
                                            return [2 /*return*/, "continue"];
                                        }
                                        this_1.market
                                            //todo: put amount here
                                            .buyAsset(event_1.asset.token_id, event_1.asset.asset_contract.address, 0)
                                            .then(function (response) {
                                            var _a;
                                            //todo: better logging, maybe send to discord or something
                                            console.log("item bought successfully", (_a = response.asset) === null || _a === void 0 ? void 0 : _a.name);
                                        })
                                            .catch(function (error) {
                                            console.log("tried to buy item, but failed", event_1.asset.token_id, error);
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
    Nftbot.prototype.shouldBuy = function (event, gas, orders) {
        //is the eth cost acceptable?
        //get the orders for this tokenAddress, and then find sell orders for that tokenId
        var starting_price = +event.starting_price;
        if (starting_price > this.ethLimit) {
            return false;
        }
        //check if gwei price matches
        if (event.asset.asset_contract.buyer_fee_basis_points > this.gasLimit) {
            return false;
        }
        return false;
    };
    return Nftbot;
}());
exports.Nftbot = Nftbot;
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
//# sourceMappingURL=nftbot.js.map