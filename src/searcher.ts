import superagent from "superagent";
import * as fs from "fs";

/*
   curl --request GET \
     --url 'https://api.opensea.io/api/v1/events?collection_slug=weape24&event_type=created&only_opensea=false&offset=0&limit=20' \
     --header 'Accept: application/json'
* */

export type SearchResults = {
  asset_events: MarketEvent[];
};

export type MarketEvent = {
  id: string;
  asset: Asset;
  collection_slug: string;
  contract_address: string;
  event_type: string;
  starting_price: string;
  ending_price: string;
};

export type Asset = {
  id: string;
  token_id: string;
  num_sales: number;
  image_url: string;
  image_preview_url: string;
  image_thumbnail_url: string;
  image_original_url: string;
  name: string;
  description: string;
  asset_contract: Contract;
  permalink: string;
  collection: Collection;
  owner: Owner;
};

export type Contract = {
  address: string;
  asset_contract_type: string;
  created_date: string;
  name: string;
  nft_version: string;
  opensea_version: string;
  owner: number;
  opensea_buyer_fee_basis_points: number;
  opeansea_seller_fee_basis_points: number;
  buyer_fee_basis_points: number;
  seller_fee_basis_points: number;
  payout_address: string;
};

export type Collection = {
  hidden: boolean;
  image_url: string;
  name: string;
  payout_address: string;
  slug: string;
};

export type Owner = {
  user: User;
  profile_img_url: string;
  address: string;
  config: string;
};

export type User = {
  username: string;
};

export interface IOpenSeaSearch {
  Check(
    collection: string,
    event_type: string,
    offset: number,
    limit: number
  ): Promise<SearchResults>;
}

export class HTTPRetriever implements IOpenSeaSearch {
  private base: string;
  constructor(base: string) {
    this.base = base;
  }
  async Check(
    // base: string,
    collection: string,
    event_type: string,
    offset: number,
    limit: number
  ): Promise<SearchResults> {
    return new Promise<SearchResults>(async (resolve, reject) => {
      try {
        const res = await superagent.get(this.base).query({
          collection_slug: collection,
          event_type: event_type,
          only_opensea: false,
          offset: offset,
          limit: limit,
        });
        resolve(res.body as SearchResults);
      } catch (err) {
        reject(err);
      }
    });
  }
}

export class FileRetriever implements IOpenSeaSearch {
  constructor() {}
  Check(
    collection: string,
    event_type: string,
    offset: number,
    limit: number
  ): Promise<SearchResults> {
    return new Promise<SearchResults>((resolve) => {
      const resultString: string = fs.readFileSync(
        "./tests/example.json",
        "utf8"
      );
      const resultJson = JSON.parse(resultString);
      let resultType = {};
      Object.assign(resultType, resultJson);
      resolve(resultType as SearchResults);
    });
  }
}
