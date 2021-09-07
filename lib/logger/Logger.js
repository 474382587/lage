"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogLevel_1 = require("./LogLevel");
const NpmLogReporter_1 = require("./reporters/NpmLogReporter");
class Logger {
    constructor() {
        this.logs = [];
    }
    log(level, msg, data) {
        var _a;
        const entry = {
            timestamp: Date.now(),
            level,
            msg,
            data,
        };
        this.logs.push(entry);
        for (const reporter of Logger.reporters) {
            (_a = reporter.log) !== null && _a !== void 0 ? _a : (entry);
        }
    }
    info(msg, data) {
        console.log('info: ', msg);
        this.log(LogLevel_1.LogLevel.info, msg, data);
    }
    warn(msg, data) {
        console.log('warn: ', msg);
        this.log(LogLevel_1.LogLevel.warn, msg, data);
    }
    error(msg, data) {
        console.log('error: ', msg);
        this.log(LogLevel_1.LogLevel.error, msg, data);
    }
    verbose(msg, data) {
        console.log('verbose: ', msg);
        this.log(LogLevel_1.LogLevel.verbose, msg, data);
    }
    silly(msg, data) {
        console.log('silly: ', msg);
        this.log(LogLevel_1.LogLevel.silly, msg, data);
    }
}
exports.Logger = Logger;
Logger.reporters = [
    new NpmLogReporter_1.NpmLogReporter({ logLevel: LogLevel_1.LogLevel.info }),
];
