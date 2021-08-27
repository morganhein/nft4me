"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Check = void 0;
var superagent_1 = __importDefault(require("superagent"));
function Check(base, collection, event_type, offset, limit, fn) {
    superagent_1.default
        .get(base)
        .query({
        collection_slug: collection,
        event_type: event_type,
        only_opensea: false,
        offset: offset,
        limit: limit,
    })
        .end(fn);
}
exports.Check = Check;
//# sourceMappingURL=watcher.js.map