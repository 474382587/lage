"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cosmiconfig_1 = require("cosmiconfig");
const workspace_tools_1 = require("workspace-tools");
const args_1 = require("../args");
const os_1 = __importDefault(require("os"));
function getConfig(cwd) {
    // Verify presence of git
    const root = workspace_tools_1.getWorkspaceRoot(cwd);
    if (!root) {
        throw new Error("This must be called inside a codebase that is part of a JavaScript workspace.");
    }
    // Search for lage.config.js file
    const ConfigModuleName = "lage";
    const configResults = cosmiconfig_1.cosmiconfigSync(ConfigModuleName).search(root || cwd);
    // Parse CLI args
    const parsedArgs = args_1.parseArgs();
    if (!args_1.validateInput(parsedArgs)) {
        throw new Error("Invalid arguments passed in");
    }
    const command = parsedArgs._;
    // deps should be default true, unless exclusively turned off with '--no-deps' or from config file with "deps: false"
    let deps = parsedArgs.deps === false
        ? false
        : (configResults === null || configResults === void 0 ? void 0 : configResults.config.deps) === false
            ? false
            : true;
    let scope = parsedArgs.scope || (configResults === null || configResults === void 0 ? void 0 : configResults.config.scope) || [];
    // the --to arg means that we will not build any of the dependents and limit the scope
    if (parsedArgs.to) {
        scope = scope.concat(parsedArgs.to);
        deps = false;
    }
    return {
        reporter: parsedArgs.reporter || "npmLog",
        grouped: parsedArgs.grouped || false,
        args: args_1.getPassThroughArgs(command, parsedArgs),
        cache: parsedArgs.cache === false ? false : true,
        resetCache: parsedArgs.resetCache || false,
        cacheOptions: Object.assign(Object.assign({}, configResults === null || configResults === void 0 ? void 0 : configResults.config.cacheOptions), (parsedArgs.cacheKey && { cacheKey: parsedArgs.cacheKey })) || {},
        command,
        concurrency: parsedArgs.concurrency || (configResults === null || configResults === void 0 ? void 0 : configResults.config.concurrency) ||
            os_1.default.cpus().length,
        deps,
        ignore: parsedArgs.ignore || (configResults === null || configResults === void 0 ? void 0 : configResults.config.ignore) || [],
        node: parsedArgs.node ? args_1.arrifyArgs(parsedArgs.node) : [],
        npmClient: (configResults === null || configResults === void 0 ? void 0 : configResults.config.npmClient) || "npm",
        pipeline: (configResults === null || configResults === void 0 ? void 0 : configResults.config.pipeline) || {},
        priorities: (configResults === null || configResults === void 0 ? void 0 : configResults.config.priorities) || [],
        profile: parsedArgs.profile,
        scope,
        since: parsedArgs.since || undefined,
        verbose: parsedArgs.verbose,
        parallel: parsedArgs.parallel,
        only: false,
        repoWideChanges: (configResults === null || configResults === void 0 ? void 0 : configResults.config.repoWideChanges) || [
            "lage.config.js",
            "package-lock.json",
            "yarn.lock",
            "pnpm-lock.yaml",
            "lerna.json",
            "rush.json",
        ],
        to: parsedArgs.to || [],
        continue: parsedArgs.continue || (configResults === null || configResults === void 0 ? void 0 : configResults.config.continue),
        safeExit: parsedArgs.safeExit,
        includeDependencies: parsedArgs.includeDependencies,
        clear: parsedArgs.clear || false,
        prune: parsedArgs.prune,
        logLevel: parsedArgs.logLevel,
        loggerOptions: (configResults === null || configResults === void 0 ? void 0 : configResults.config.loggerOptions) || {},
    };
}
exports.getConfig = getConfig;
