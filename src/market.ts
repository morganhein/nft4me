import { OpenSeaPort, Network } from "opensea-js";
import Web3 from "web3";
import { provider } from "web3-core";
import { OpenSeaAsset, Order, OrderSide } from "opensea-js/lib/types";

//operations that are performed against the OpenSea SDK on the Ethereum blockchain, not the
//OpenSea API over http
export interface IBlockMarket {
  getAsset(tokenAddress: string, tokenId: string): Promise<OpenSeaAsset>;
  buyAsset(
    tokenAddress: string,
    tokenId: string,
    amount: number
  ): Promise<Order>;
  getGas(): Promise<string>;
  getOrders(contractAddress: string, token_id: string): Promise<Order[]>;
}

export class Web3Market implements IBlockMarket {
  readonly provider: provider;
  private seaport: OpenSeaPort;
  private w3;
  constructor(private host: string, private walletAddress: string) {
    this.provider = new Web3.providers.HttpProvider(
      host //"https://mainnet.infura.io"
    );
    this.seaport = new OpenSeaPort(this.provider, {
      networkName: Network.Main,
    });
    this.w3 = new Web3(this.provider);
  }

  async buyAsset(
    tokenAddress: string,
    tokenId: string,
    amount: number
  ): Promise<Order> {
    return new Promise<Order>(async (resolve, reject) => {
      try {
        let buyOrder = await this.seaport.createBuyOrder({
          asset: {
            tokenId,
            tokenAddress,
          } as OpenSeaAsset,
          accountAddress: this.walletAddress,
          startAmount: amount,
          quantity: 1,
          // expirationTime: "",
        });
        resolve(buyOrder);
      } catch (error) {
        console.log("error buying asset", error);
        reject(error);
      }
    });
  }

  // let tokenAddress: string = res.body.Asset.Asset_Contract.address;
  // let tokenId: number = res.body.Asset.token_id;
  async getAsset(tokenAddress: string, tokenId: string): Promise<OpenSeaAsset> {
    return new Promise<OpenSeaAsset>(async (resolve, reject) => {
      try {
        let asset: OpenSeaAsset = await this.seaport.api.getAsset({
          tokenAddress,
          tokenId,
        });
        resolve(asset);
      } catch (err) {
        reject(err);
      }
    });
  }

  async getGas(): Promise<string> {
    try {
      return await this.w3.eth.getGasPrice();
    } catch (error) {
      console.log(error);
      //return -1 here so we don't accidentally buy tons of shit when the gas price is above 200 but this query failed
      return "-1";
    }
  }

  async getOrders(contractAddress: string, token_id: string): Promise<Order[]> {
    return new Promise<Order[]>(async (resolve, reject) => {
      try {
        let orders = await this.seaport.api.getOrders({
          asset_contract_address: contractAddress,
          token_id: token_id,
          side: OrderSide.Sell,
        });
        if (orders.count == 0) {
          reject("no orders found at that address");
        }
        resolve(orders.orders);
      } catch (error) {
        console.log("error retrieving orders", error);
        reject(error);
      }
    });
  }
}
