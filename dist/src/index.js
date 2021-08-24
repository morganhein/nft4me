"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var web3_1 = __importDefault(require("web3"));
var opensea_js_1 = require("opensea-js");
var watcher_1 = require("./watcher");
// This example provider won't let you make transactions, only read-only calls:
var provider = new web3_1.default.providers.HttpProvider('https://mainnet.infura.io');
var seaport = new opensea_js_1.OpenSeaPort(provider, {
    networkName: opensea_js_1.Network.Main
});
watcher_1.Check("https://api.opensea.io/api/v1/events?", "collection_slug=weape24&event_type=created&only_opensea=false&offset=0&limit=20");
