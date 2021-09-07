"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cacheConfig_1 = require("./cacheConfig");
const logger_1 = require("../logger");
const salt_1 = require("./salt");
const backfill = __importStar(require("backfill/lib/api"));
async function cacheHash(id, cwd, root, cacheOptions, args) {
    const cacheConfig = cacheConfig_1.getCacheConfig(cwd, cacheOptions);
    const backfillLogger = backfill.makeLogger("error", process.stdout, process.stderr);
    const hashKey = salt_1.salt(cacheOptions.environmentGlob || ["lage.config.js"], `${id}|${JSON.stringify(args)}`, root, cacheOptions.cacheKey);
    backfillLogger.setName(id);
    try {
        return await backfill.computeHash(cwd, backfillLogger, hashKey, cacheConfig);
    }
    catch (_a) {
        // computeHash can throw exception when git is not installed or the repo hashes cannot be calculated with a staged file that is deleted
        // lage will continue as if this package cannot be cached
    }
    return null;
}
exports.cacheHash = cacheHash;
async function cacheFetch(hash, id, cwd, cacheOptions) {
    if (!hash) {
        return false;
    }
    const cacheConfig = cacheConfig_1.getCacheConfig(cwd, cacheOptions);
    const backfillLogger = backfill.makeLogger("error", process.stdout, process.stderr);
    try {
        return await backfill.fetch(cwd, hash, backfillLogger, cacheConfig);
    }
    catch (e) {
        logger_1.logger.error(`${id} fetchBackfill`, e);
    }
    return false;
}
exports.cacheFetch = cacheFetch;
async function cachePut(hash, cwd, cacheOptions) {
    if (!hash) {
        return;
    }
    const cacheConfig = cacheConfig_1.getCacheConfig(cwd, cacheOptions);
    const backfillLogger = backfill.makeLogger("warn", process.stdout, process.stderr);
    try {
        await backfill.put(cwd, hash, backfillLogger, cacheConfig);
    }
    catch (e) {
        // sometimes outputGlob don't match any files, so skipping this
    }
}
exports.cachePut = cachePut;
