"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../logger");
const getWorkspace_1 = require("../workspace/getWorkspace");
const MS_IN_A_DAY = 1000 * 60 * 60 * 24;
async function cache(cwd, config) {
    if (config.clear) {
        logger_1.logger.info("clearing cache, this may take a while");
        clearCache(cwd, config);
        logger_1.logger.info("done!");
    }
    else if (config.prune) {
        logger_1.logger.info("pruning cache, this may take a while");
        pruneCache(cwd, config);
        logger_1.logger.info("done!");
    }
    else {
        logger_1.logger.info("No options given to cache command. Try --clear or --prune");
    }
}
exports.cache = cache;
function clearCache(cwd, config) {
    const workspace = getWorkspace_1.getWorkspace(cwd, config);
    const { allPackages } = workspace;
    for (const info of Object.values(allPackages)) {
        const cachePath = getCachePath(info);
        if (fs_1.default.existsSync(cachePath)) {
            const entries = fs_1.default.readdirSync(cachePath);
            for (const entry of entries) {
                logger_1.logger.verbose(`clearing cache for ${info.name}`);
                const entryPath = path_1.default.join(cachePath, entry);
                const entryStat = fs_1.default.statSync(entryPath);
                remove(entryPath, entryStat);
            }
        }
    }
}
function pruneCache(cwd, config) {
    const prunePeriod = parseInt(config.prune) || 30;
    const now = new Date();
    const workspace = getWorkspace_1.getWorkspace(cwd, config);
    const { allPackages } = workspace;
    for (const info of Object.values(allPackages)) {
        const cachePath = getCachePath(info);
        if (fs_1.default.existsSync(cachePath)) {
            const entries = fs_1.default.readdirSync(cachePath);
            for (const entry of entries) {
                const entryPath = path_1.default.join(cachePath, entry);
                const entryStat = fs_1.default.statSync(entryPath);
                logger_1.logger.verbose(`clearing cache for ${info.name}`);
                if (now.getTime() - entryStat.mtime.getTime() >
                    prunePeriod * MS_IN_A_DAY) {
                    remove(entryPath, entryStat);
                }
            }
        }
    }
}
function getCachePath(info) {
    return path_1.default.join(info.packageJsonPath, "../node_modules/.cache/backfill");
}
function remove(entryPath, entryStat) {
    if (entryStat.isDirectory()) {
        fs_1.default.rmdirSync(entryPath, { recursive: true });
    }
    else {
        fs_1.default.unlinkSync(entryPath);
    }
}
