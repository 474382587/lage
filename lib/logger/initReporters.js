"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./Logger");
const NpmLogReporter_1 = require("./reporters/NpmLogReporter");
const LogLevel_1 = require("./LogLevel");
const JsonReporter_1 = require("./reporters/JsonReporter");
const AdoReporter_1 = require("./reporters/AdoReporter");
function initReporters(config) {
    // Initialize logger
    let logLevel = config.verbose ? LogLevel_1.LogLevel.verbose : LogLevel_1.LogLevel.info;
    if (config.logLevel) {
        logLevel = LogLevel_1.LogLevel[config.logLevel];
    }
    const reporters = [
        config.reporter === "json"
            ? new JsonReporter_1.JsonReporter({ logLevel })
            : new NpmLogReporter_1.NpmLogReporter({
                logLevel,
                grouped: config.grouped,
                npmLoggerOptions: config.loggerOptions
            }),
    ];
    // if ADO env - add this 
    const isAdoPipeline = !!process.env["SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"];
    if (isAdoPipeline) {
        reporters.push(new AdoReporter_1.AdoReportor());
    }
    Logger_1.Logger.reporters = reporters;
    return reporters;
}
exports.initReporters = initReporters;
