"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatDuration_1 = require("./formatDuration");
class JsonReporter {
    constructor(options) {
        this.options = options;
    }
    log(entry) {
        if (this.options.logLevel >= entry.level) {
            console.log(JSON.stringify(entry));
        }
    }
    summarize(context) {
        const { measures, targets } = context;
        const summary = {};
        const taskStats = [];
        for (const wrappedTarget of targets.values()) {
            taskStats.push({
                package: wrappedTarget.target.packageName,
                task: wrappedTarget.target.task,
                duration: formatDuration_1.hrToSeconds(wrappedTarget.duration),
                status: wrappedTarget.status,
                npmArgs: wrappedTarget.npmArgs,
            });
        }
        if (measures.failedTargets && measures.failedTargets.length > 0) {
            summary.failedTargets = measures.failedTargets;
        }
        summary.duration = formatDuration_1.hrToSeconds(measures.duration);
        summary.taskStats = taskStats;
        console.log(JSON.stringify({ summary }));
    }
}
exports.JsonReporter = JsonReporter;
