import { FileRetriever, HTTPRetriever, IOpenSeaSearch } from "../src/searcher";

describe("OpenSea API", function () {
  test("retrieving a page of 50 via HTTP results works", async () => {
    const searcher: IOpenSeaSearch = new HTTPRetriever(
      "https://api.opensea.io/api/v1/events"
    );
    try {
      let results = await searcher.Check("weape24", "created", 0, 50);
      expect(results.asset_events).toHaveLength(50);
    } catch (error) {
      expect(error).toBeNull();
    }
  });

  test("loading a file of assets for mocks works", async () => {
    const searcher: IOpenSeaSearch = new FileRetriever();
    try {
      let results = await searcher.Check("weape24", "created", 0, 20);
      //there are only 20 results saved in the local JSON, so that's all we get
      expect(results.asset_events).toHaveLength(20);
    } catch (error) {
      expect(error).toBeNull();
    }
  });
});
