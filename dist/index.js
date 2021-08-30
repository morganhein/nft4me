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
var config_1 = require("./config");
var nftbot_1 = require("./nftbot");
var searcher_1 = require("./searcher");
var market_1 = require("./market");
var logging_1 = require("./logging");
var bignumber_js_1 = require("bignumber.js");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var c, searcher, market, nftBot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    c = config_1.Config("live");
                    logging_1.logger.info(c);
                    searcher = new searcher_1.HTTPRetriever(c.OpenSeaAPI);
                    if (c.Mnemonic.length === 0 || c.SourceWallet.length === 0) {
                        //we don't have a mnemonic, so just use http market
                        market = new market_1.HTTPMarket(c);
                        logging_1.logger.info("No mnemonic or wallet address found, using HTTP market.");
                    }
                    else {
                        //we have a mnemonic, so try to login
                        logging_1.logger.info("Mnemonic & wallet address found, using Web3Market.");
                        market = new market_1.Web3Market(c);
                    }
                    nftBot = new nftbot_1.Nftbot(searcher, market, c.Collection, new bignumber_js_1.BigNumber(c.EthLimit), new bignumber_js_1.BigNumber(c.GasLimit), c.DryRun);
                    return [4 /*yield*/, nftBot.start()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main().then(function () {
    logging_1.logger.info("finished running");
});
//# sourceMappingURL=index.js.map