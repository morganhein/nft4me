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
var market_1 = require("../src/market");
var config_1 = require("../src/config");
describe("OpenSea SDK", function () {
    var _this = this;
    var market = new market_1.Web3Market(config_1.ENV.MarketHost, config_1.ENV.SourceWallet);
    var contractAddress = "0x495f947276749ce646f68ac8c248420045cb7b5e";
    var tokenId = "108510973921457929967077298367545831468135648058682555520544981548390263291905";
    test("retrieving the gas price works", function () { return __awaiter(_this, void 0, void 0, function () {
        var gas, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, market.getGas()];
                case 1:
                    gas = _a.sent();
                    expect(gas).not.toBeNull();
                    expect(gas).not.toEqual("-1");
                    console.log(gas);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    expect(error_1).toBeNull();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }, 9000);
    test("retrieving an asset works", function () { return __awaiter(_this, void 0, void 0, function () {
        var asset, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, market.getAsset(contractAddress, tokenId)];
                case 1:
                    asset = _a.sent();
                    expect(asset).not.toBeNull();
                    expect(asset.name).toEqual("PixelApe 435");
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    expect(error_2).toBeNull();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    test("retrieving orders works", function () { return __awaiter(_this, void 0, void 0, function () {
        var orders, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, market.getOrders(contractAddress, tokenId)];
                case 1:
                    orders = _a.sent();
                    expect(orders).not.toBeNull();
                    expect(orders.length).toBeGreaterThan(0);
                    console.log(orders);
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    expect(error_3).toBeNull();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=market.test.js.map