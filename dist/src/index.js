"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Web3 = require("web3");
const opensea_js_1 = require("opensea-js");
// This example provider won't let you make transactions, only read-only calls:
const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io');
let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
//comments
const seaport = new opensea_js_1.OpenSeaPort(provider, {
    networkName: opensea_js_1.Network.Main
});
