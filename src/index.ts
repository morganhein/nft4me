import * as Web3 from 'web3'
import { OpenSeaPort, Network } from 'opensea-js'

// This example provider won't let you make transactions, only read-only calls:
const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io')

let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");


const seaport = new OpenSeaPort(provider, {
  networkName: Network.Main
})