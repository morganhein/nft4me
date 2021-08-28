import { HTTPMarket, IBlockMarket } from "../src/market";
import { Config } from "../src/config";
//https://api.opensea.io/wyvern/v1/orders?asset_contract_address=0x495f947276749ce646f68ac8c248420045cb7b5e&token_id=108510973921457929967077298367545831468135648058682555520544981548390263291905&bundled=true&include_bundled=true&include_invalid=false&limit=20&offset=0&order_by=created_date&order_direction=desc
describe("OpenSea SDK", function () {
  let c = Config("tests");

  const market: IBlockMarket = new HTTPMarket(c);

  test("retrieving the gas price works", async () => {
    try {
      const gas = await market.getGas();
      expect(gas).not.toBeNull();
      expect(gas).not.toEqual("-1");
    } catch (error) {
      expect(error).toBeNull();
    }
  }, 9000);

  test("retrieving an asset works", async () => {
    const contractAddress = "0x495f947276749ce646f68ac8c248420045cb7b5e";
    const tokenId =
      "108510973921457929967077298367545831468135648058682555520544981548390263291905";
    try {
      const asset = await market.getAsset(contractAddress, tokenId);
      expect(asset).not.toBeNull();
      expect(asset.name).toEqual("PixelApe 435");
    } catch (error) {
      expect(error).toBeNull();
    }
  });

  test("retrieving orders works", async () => {
    const contractAddress = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d";
    const tokenId = "9948";
    try {
      const orders = await market.getOrders(contractAddress, tokenId);
      expect(orders).not.toBeNull();
      expect(orders.length).toBeGreaterThan(0);
    } catch (error) {
      expect(error).toBeNull();
    }
  });
});
