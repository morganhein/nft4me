import { OpenSeaPort, Network } from "opensea-js";
import Web3 from "web3";
import { provider } from "web3-core";
import { OpenSeaAsset, Order, OrderSide } from "opensea-js/lib/types";
import { logger } from "./logging";
import { BigNumber } from "bignumber.js";
import {
  MnemonicWalletSubprovider,
  RPCSubprovider,
  Web3ProviderEngine,
} from "@0x/subproviders";
import { IConfig } from "./config";

//operations that are performed against the OpenSea SDK on the Ethereum blockchain, not the
//OpenSea API over http
export interface IBlockMarket {
  getAsset(tokenAddress: string, tokenId: string): Promise<OpenSeaAsset>;
  buyAsset(
    tokenAddress: string,
    tokenId: string,
    amount: BigNumber,
    dryRun: boolean
  ): Promise<Order>;
  getGas(): Promise<string>;
  getOrders(contractAddress: string, token_id: string): Promise<Order[]>;
}

export class Market implements IBlockMarket {
  // @ts-ignore
  protected seaport: OpenSeaPort;
  // @ts-ignore
  protected w3;
  protected network: string;
  constructor(private config: IConfig) {
    this.config = config;
    this.network = config.NetworkURI;
  }

  async buyAsset(
    tokenAddress: string,
    tokenId: string,
    amount: BigNumber,
    dryRun: boolean
  ): Promise<Order> {
    return new Promise<Order>(async (resolve, reject) => {
      if (dryRun) {
        logger.info("Dryrun enabled, would have bought", tokenId);
        resolve({} as Order);
        return;
      }
      try {
        let buyOrder = await this.seaport.createBuyOrder({
          asset: {
            tokenId,
            tokenAddress,
          } as OpenSeaAsset,
          accountAddress: this.config.SourceWallet,
          startAmount: amount.toNumber(),
          quantity: 1,
          // expirationTime: "",
        });
        resolve(buyOrder);
      } catch (error) {
        logger.error("error buying asset", error);
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
      logger.error(error);
      //return -1 here so we don't accidentally buy tons of shit when the gas price is above 200 but this query failed
      return "-1";
    }
  }

  async getOrders(contractAddress: string, token_id: string): Promise<Order[]> {
    return new Promise<Order[]>(async (resolve, reject) => {
      logger.info({
        message: "retrieving orders",
        token_id: token_id,
        asset_contract_address: contractAddress,
      });
      try {
        let orders = await this.seaport.api.getOrders({
          asset_contract_address: contractAddress,
          token_id: token_id,
          side: OrderSide.Sell,
        });
        if (orders.count == 0) {
          reject("no orders found at that address");
        }
        if (orders.count != orders.orders.length) {
          reject(
            "incorrect amount of orders returned, expected " +
              orders.count +
              " but found " +
              orders.orders.length
          );
        }
        resolve(orders.orders);
      } catch (error) {
        logger.error("error retrieving orders", error);
        reject(error);
      }
    });
  }
}

export class Web3Market extends Market {
  constructor(config: IConfig) {
    super(config);
    const BASE_DERIVATION_PATH = `44'/60'/0'/0`;

    const mnemonicWalletSubprovider = new MnemonicWalletSubprovider({
      mnemonic: config.Mnemonic,
      baseDerivationPath: BASE_DERIVATION_PATH,
    });

    const infuraRpcSubprovider = new RPCSubprovider(this.network);

    const providerEngine = new Web3ProviderEngine();
    providerEngine.addProvider(mnemonicWalletSubprovider);
    providerEngine.addProvider(infuraRpcSubprovider);
    providerEngine.start();

    //
    // this.seaport = new OpenSeaPort(
    //   providerEngine,
    //   {
    //     networkName:
    //       config.NetworkName === "mainnet" || config.NetworkName === "live"
    //         ? Network.Main
    //         : Network.Rinkeby,
    //     apiKey: config.OpenSeaAPIKey,
    //   },
    //   (arg) => console.log(arg)
    // );

    this.w3 = new Web3(new Web3.providers.HttpProvider(this.network));
  }
}

export class HTTPMarket extends Market {
  constructor(config: IConfig) {
    super(config);
    const provider = new Web3.providers.HttpProvider(this.network);
    this.seaport = new OpenSeaPort(provider, {
      networkName: Network.Main,
    });
    this.w3 = new Web3(provider);
  }
}
