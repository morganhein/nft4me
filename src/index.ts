import Web3 from 'web3'
import { OpenSeaPort, Network } from 'opensea-js'
import { Check } from "./watcher";

// This example provider won't let you make transactions, only read-only calls:
const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io')

const seaport = new OpenSeaPort(provider, {
  networkName: Network.Main
})

Check("https://api.opensea.io/api/v1/events?", "collection_slug=weape24&event_type=created&only_opensea=false&offset=0&limit=20")
