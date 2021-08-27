import { IBlockMarket, Web3Market } from "../src/market";
import { ENV } from "../src/config";

describe("OpenSea SDK", function () {
  const market: IBlockMarket = new Web3Market(ENV.MarketHost, ENV.SourceWallet);

  const contractAddress = "0x495f947276749ce646f68ac8c248420045cb7b5e";
  const tokenId =
    "108510973921457929967077298367545831468135648058682555520544981548390263291905";

  test("retrieving the gas price works", async () => {
    try {
      const gas = await market.getGas();
      expect(gas).not.toBeNull();
      expect(gas).not.toEqual("-1");
      console.log(gas);
    } catch (error) {
      expect(error).toBeNull();
    }
  }, 9000);

  test("retrieving an asset works", async () => {
    try {
      const asset = await market.getAsset(contractAddress, tokenId);
      expect(asset).not.toBeNull();
      expect(asset.name).toEqual("PixelApe 435");
    } catch (error) {
      expect(error).toBeNull();
    }
  });

  test("retrieving orders works", async () => {
    try {
      const orders = await market.getOrders(contractAddress, tokenId);
      expect(orders).not.toBeNull();
      expect(orders.length).toBeGreaterThan(0);
      console.log(orders);
    } catch (error) {
      expect(error).toBeNull();
    }
  });
});
