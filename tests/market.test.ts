import { IBlockMarket, Web3Market } from "../src/market";

describe("OpenSea SDK", function () {
  const market: IBlockMarket = new Web3Market(
    "https://mainnet.infura.io/v3/0039582f375a4ed09d06e6948d1a5ac4",
    ""
  );

  const contractAddress = "0x495f947276749ce646f68ac8c248420045cb7b5e";
  const tokenId =
    "108510973921457929967077298367545831468135648058682555520544981548390263291905";

  test("retrieving the gas price works", async () => {
    try {
      const gas = await market.getGas();
      expect(gas).not.toBeNull();
      //todo: not a great test, b/c it's possible that the gas price *is* actually 201...
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
      const orders = await market.getOrders(
        "0x14f03368b43e3a3d27d45f84fabd61cc07ea5da3",
        "8284"
      );
      expect(orders).not.toBeNull();
      expect(orders.length).toBeGreaterThan(0);
      console.log(orders);
    } catch (error) {
      expect(error).toBeNull();
    }
  });
});
