"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cosmiconfig_1 = require("cosmiconfig");
const path_1 = __importDefault(require("path"));
const ConfigModuleName = "lage";
function getPipeline(info) {
    const results = cosmiconfig_1.cosmiconfigSync(ConfigModuleName).search(path_1.default.dirname(info.packageJsonPath));
    if (results && results.config) {
        return results.config.pipeline;
    }
    return null;
}
function getPackagePipelines(allPackages, defaultPipeline) {
    const packagePipelines = new Map();
    for (const pkg of Object.keys(allPackages)) {
        const pipeline = getPipeline(allPackages[pkg]);
        if (pipeline) {
            packagePipelines.set(pkg, pipeline);
        }
        else {
            packagePipelines.set(pkg, defaultPipeline);
        }
    }
    return packagePipelines;
}
exports.getPackagePipelines = getPackagePipelines;
