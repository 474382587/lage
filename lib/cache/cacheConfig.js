"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const backfill_config_1 = require("backfill-config");
const backfill_logger_1 = require("backfill-logger");
function getCacheConfig(cwd, cacheOptions) {
    const defaultCacheConfig = backfill_config_1.createDefaultConfig(cwd);
    // in lage, default mode is to CACHE locally
    defaultCacheConfig.cacheStorageConfig.provider = "local";
    const logger = backfill_logger_1.makeLogger("warn");
    const envConfig = backfill_config_1.getEnvConfig(logger);
    return Object.assign(Object.assign(Object.assign({}, defaultCacheConfig), cacheOptions), envConfig);
}
exports.getCacheConfig = getCacheConfig;
