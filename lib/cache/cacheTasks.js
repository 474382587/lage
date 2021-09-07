"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheHashTask = "backfillHash";
exports.CacheFetchTask = "backfillFetch";
exports.CachePutTask = "backfillPut";
function isCacheTask(task) {
    return (task === exports.CacheHashTask || task === exports.CacheFetchTask || task === exports.CachePutTask);
}
exports.isCacheTask = isCacheTask;
