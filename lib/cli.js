"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getConfig_1 = require("./config/getConfig");
const init_1 = require("./command/init");
const run_1 = require("./command/run");
const showHelp_1 = require("./showHelp");
const logger_1 = require("./logger");
const info_1 = require("./command/info");
const initReporters_1 = require("./logger/initReporters");
const version_1 = require("./command/version");
const cache_1 = require("./command/cache");
// Parse CLI args
const cwd = process.cwd();
try {
    const config = getConfig_1.getConfig(cwd);
    const reporters = initReporters_1.initReporters(config);
    switch (config.command[0]) {
        case "cache":
            cache_1.cache(cwd, config);
            break;
        case "init":
            init_1.init(cwd);
            break;
        case "info":
            info_1.info(cwd, config);
            break;
        case "version":
            version_1.version();
            break;
        default:
            logger_1.logger.info(`Lage task runner - let's make it`);
            run_1.run(cwd, config, reporters);
            break;
    }
}
catch (e) {
    showHelp_1.showHelp(e.message);
}
