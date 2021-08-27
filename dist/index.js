"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var nftbot_1 = require("./nftbot");
var searcher_1 = require("./searcher");
var market_1 = require("./market");
function main() {
    var collection = "weape24";
    var searcher = new searcher_1.HTTPRetriever(config_1.ENV.OpenSeaHTTPAPI);
    var market = new market_1.Web3Market(config_1.ENV.MarketHost, config_1.ENV.SourceWallet);
    var nftBot = new nftbot_1.Nftbot(searcher, market, collection, +config_1.ENV.EthLimit, +config_1.ENV.GasLimit);
    nftBot.start();
}
// main();
console.log(config_1.ENV.Collection);
console.log(config_1.ENV.MarketHost);
//# sourceMappingURL=index.js.map