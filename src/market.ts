import { OpenSeaPort, Network } from "opensea-js";
import Web3 from "web3";
import { provider } from "web3-core";
import { OpenSeaAsset } from "opensea-js/lib/types";

//operations that are performed against the OpenSea SDK on the Ethereum blockchain, not the
//OpenSea API over http
export interface IBlockMarket {
  getAsset(tokenAddress: string, tokenId: string): Promise<OpenSeaAsset>;
  buyAsset(tokenAddress: string, tokenId: string): Promise<OpenSeaAsset>;
  getGas(): Promise<string>;
}

export class Web3Market implements IBlockMarket {
  readonly provider: provider;
  private seaport: OpenSeaPort;
  private w3;
  constructor(private host: string) {
    this.provider = new Web3.providers.HttpProvider(
      host //"https://mainnet.infura.io"
    );
    this.seaport = new OpenSeaPort(this.provider, {
      networkName: Network.Main,
    });
    this.w3 = new Web3(this.provider);
  }

  buyAsset(tokenAddress: string, tokenId: string): Promise<OpenSeaAsset> {
    throw new Error("Method not implemented.");
  }

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
    // let tokenAddress: string = res.body.Asset.Asset_Contract.address;
    // let tokenId: number = res.body.Asset.token_id;
  }

  async getGas(): Promise<string> {
    try {
      return await this.w3.eth.getGasPrice();
    } catch (error) {
      console.log(error);
      return "10";
    }
  }
}
