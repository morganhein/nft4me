"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Check = void 0;
var superagent_1 = __importDefault(require("superagent"));
/*
   curl --request GET \
     --url 'https://api.opensea.io/api/v1/events?collection_slug=weape24&event_type=created&only_opensea=false&offset=0&limit=20' \
     --header 'Accept: application/json'
* */
function Check(base, parameters) {
    superagent_1.default
        .get(base + parameters)
        .end(function (err, res) {
        console.log(res);
    });
}
exports.Check = Check;
