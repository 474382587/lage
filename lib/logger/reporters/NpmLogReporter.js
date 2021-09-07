"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const npmlog_1 = __importDefault(require("npmlog"));
const chalk_1 = __importDefault(require("chalk"));
const LogLevel_1 = require("../LogLevel");
const formatDuration_1 = require("./formatDuration");
const taskId_1 = require("../../task/taskId");
const maxLengths = {
    pkg: 0,
    task: 0,
};
const colors = {
    info: chalk_1.default.white,
    verbose: chalk_1.default.gray,
    warn: chalk_1.default.white,
    error: chalk_1.default.white,
    task: chalk_1.default.cyan,
    pkg: chalk_1.default.magenta,
};
function getTaskLogPrefix(pkg, task) {
    return `${colors.pkg(pkg.padStart(maxLengths.pkg))} ${colors.task(task.padStart(maxLengths.task))}`;
}
function normalize(prefixOrMessage, message) {
    if (typeof message === "string") {
        const prefix = prefixOrMessage;
        return { prefix, message };
    }
    else {
        const prefix = "";
        const message = prefixOrMessage;
        return { prefix, message };
    }
}
function isTaskData(data) {
    return data !== undefined && data.task !== undefined;
}
function isInfoData(data) {
    return data !== undefined && data.command !== undefined;
}
class NpmLogReporter {
    constructor(options) {
        var _a, _b, _c;
        this.options = options;
        this.groupedEntries = new Map();
        options.logLevel = options.logLevel || LogLevel_1.LogLevel.info;
        npmlog_1.default.level = LogLevel_1.LogLevel[options.logLevel];
        npmlog_1.default.disp = Object.assign(Object.assign({}, npmlog_1.default.disp), (_a = options.npmLoggerOptions) === null || _a === void 0 ? void 0 : _a.disp);
        npmlog_1.default.style = Object.assign(Object.assign({}, npmlog_1.default.style), (_b = options.npmLoggerOptions) === null || _b === void 0 ? void 0 : _b.style);
        npmlog_1.default.levels = Object.assign(Object.assign({}, npmlog_1.default.levels), (_c = options.npmLoggerOptions) === null || _c === void 0 ? void 0 : _c.levels);
    }
    log(entry) {
        if (this.options.logLevel >= entry.level) {
            if (isTaskData(entry.data) && !this.options.grouped) {
                return this.logTaskEntry(entry.data.package, entry.data.task, entry);
            }
            else if (isTaskData(entry.data) && this.options.grouped) {
                return this.logTaskEntryInGroup(entry.data.package, entry.data.task, entry);
            }
            else if (isInfoData(entry.data)) {
                return this.logInfoEntry(entry);
            }
            else {
                return this.logGenericEntry(entry);
            }
        }
    }
    logInfoEntry(entry) {
        const infoData = entry.data;
        const logFn = npmlog_1.default[LogLevel_1.LogLevel[entry.level]];
        const colorFn = colors[LogLevel_1.LogLevel[entry.level]];
        return logFn("", colorFn(JSON.stringify(infoData, null, 2)));
    }
    logGenericEntry(entry) {
        const normalizedArgs = normalize(entry.msg);
        const logFn = npmlog_1.default[LogLevel_1.LogLevel[entry.level]];
        const colorFn = colors[LogLevel_1.LogLevel[entry.level]];
        return logFn(normalizedArgs.prefix, colorFn(normalizedArgs.message));
    }
    logTaskEntry(pkg, task, entry) {
        const normalizedArgs = this.options.grouped
            ? normalize(entry.msg)
            : normalize(getTaskLogPrefix(pkg, task), entry.msg);
        const logFn = npmlog_1.default[LogLevel_1.LogLevel[entry.level]];
        const colorFn = colors[LogLevel_1.LogLevel[entry.level]];
        const data = entry.data;
        if (data.status) {
            const pkgTask = this.options.grouped ? `${chalk_1.default.magenta(pkg)} ${chalk_1.default.cyan(task)}` : "";
            switch (data.status) {
                case "started":
                    return logFn(normalizedArgs.prefix, colorFn(`▶️ start ${pkgTask}`));
                case "completed":
                    return logFn(normalizedArgs.prefix, colorFn(`✔️ done ${pkgTask} - ${formatDuration_1.formatDuration(data.duration)}`));
                case "failed":
                    return logFn(normalizedArgs.prefix, colorFn(`❌ fail ${pkgTask}`));
                case "skipped":
                    return logFn(normalizedArgs.prefix, colorFn(`⏭️ skip ${pkgTask} - ${data.hash}`));
            }
        }
        else {
            return logFn(normalizedArgs.prefix, colorFn("|  " + normalizedArgs.message));
        }
    }
    logTaskEntryInGroup(pkg, task, logEntry) {
        var _a;
        const taskId = taskId_1.getTargetId(pkg, task);
        this.groupedEntries.set(taskId, this.groupedEntries.get(taskId) || []);
        (_a = this.groupedEntries.get(taskId)) === null || _a === void 0 ? void 0 : _a.push(logEntry);
        const data = logEntry.data;
        if (data && (data.status === "completed" || data.status === "failed" || data.status === "skipped")) {
            const entries = this.groupedEntries.get(taskId);
            for (const entry of entries) {
                this.logTaskEntry(data.package, data.task, entry);
            }
            if (entries.length > 2) {
                this.hr();
            }
        }
    }
    hr() {
        npmlog_1.default.info("", "----------------------------------------------");
    }
    summarize(context) {
        var _a;
        const { measures, targets } = context;
        const { hr } = this;
        const statusColorFn = {
            completed: chalk_1.default.greenBright,
            failed: chalk_1.default.redBright,
            skipped: chalk_1.default.gray,
            started: chalk_1.default.yellow,
            pending: chalk_1.default.gray,
        };
        npmlog_1.default.info("", chalk_1.default.cyanBright(`🏗 Summary\n`));
        if (targets.size > 0) {
            for (const wrappedTarget of targets.values()) {
                const colorFn = statusColorFn[wrappedTarget.status];
                const target = wrappedTarget.target;
                npmlog_1.default.verbose("", getTaskLogPrefix(target.packageName || "[GLOBAL]", target.task), colorFn(`${wrappedTarget.status === "started" ? "started - incomplete" : wrappedTarget.status}${wrappedTarget.duration ? `, took ${formatDuration_1.formatDuration(formatDuration_1.hrToSeconds(wrappedTarget.duration))}` : ""}`));
            }
            const successfulTasks = [...targets.values()].filter((t) => t.status === "completed");
            const skippedTasks = [...targets.values()].filter((t) => t.status === "skipped");
            npmlog_1.default.info("", `[Tasks Count] success: ${successfulTasks.length}, skipped: ${skippedTasks.length}, incomplete: ${targets.size -
                successfulTasks.length -
                skippedTasks.length}`);
        }
        else {
            npmlog_1.default.info("", "Nothing has been run.");
        }
        hr();
        if (measures.failedTargets && measures.failedTargets.length > 0) {
            for (const failedTargetId of measures.failedTargets) {
                const { packageName, task } = taskId_1.getPackageAndTask(failedTargetId);
                const taskLogs = (_a = targets.get(failedTargetId)) === null || _a === void 0 ? void 0 : _a.logger.getLogs();
                npmlog_1.default.error("", `[${chalk_1.default.magenta(packageName)} ${chalk_1.default.cyan(task)}] ${chalk_1.default.redBright("ERROR DETECTED")}`);
                if (taskLogs) {
                    npmlog_1.default.error("", taskLogs === null || taskLogs === void 0 ? void 0 : taskLogs.map((entry) => entry.msg).join("\n"));
                }
                hr();
            }
        }
        npmlog_1.default.info("", `Took a total of ${formatDuration_1.formatDuration(formatDuration_1.hrToSeconds(measures.duration))} to complete`);
    }
}
exports.NpmLogReporter = NpmLogReporter;
