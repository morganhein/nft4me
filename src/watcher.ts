import supergent from "superagent";

/*
   curl --request GET \
     --url 'https://api.opensea.io/api/v1/events?collection_slug=weape24&event_type=created&only_opensea=false&offset=0&limit=20' \
     --header 'Accept: application/json'
* */

export function Check(
  base: string,
  collection: string,
  event_type: string,
  offset: number,
  limit: number
) {
  supergent
    .get(base)
    .query({
      collection_slug: collection,
      event_type: event_type,
      only_opensea: false,
      offset: offset,
      limit: limit,
    })
    .end((err, res) => {
      console.log(res);
    });
}
