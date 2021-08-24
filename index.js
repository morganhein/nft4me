"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var web3_1 = __importDefault(require("web3"));
var web3 = new web3_1.default(new web3_1.default.providers.HttpProvider("https://rinkeby.infura.io/"));
console.log(web3);
