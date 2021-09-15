"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const taskId_1 = require("../../task/taskId");
class AdoReporter {
    summarize(context) {
        var _a;
        const { measures, targets } = context;
        if (measures.failedTargets && measures.failedTargets.length > 0) {
            let msg = ``;
            for (const failedTargetId of measures.failedTargets) {
                const { packageName, task } = taskId_1.getPackageAndTask(failedTargetId);
                const taskLogs = (_a = targets.get(failedTargetId)) === null || _a === void 0 ? void 0 : _a.logger.getLogs();
                msg += `package: ${packageName}  |  task: ${task} | error: `;
                if (taskLogs) {
                    for (let i = 0; i < taskLogs.length; i += 1) {
                        msg += taskLogs === null || taskLogs === void 0 ? void 0 : taskLogs.map((entry) => entry.msg).join("\n");
                        // if (taskLogs[i].msg.includes('Error detected while')) {
                        //     msg += `${taskLogs[i].msg}${taskLogs[i + 1].msg}${taskLogs[i + 2].msg}`
                        //     break
                        // }
                    }
                }
            }
            console.log(`##[group]Beginning of errors`);
            console.log(`##vso[task.logissue type=error]${msg}`);
            console.log(`##[endgroup]`);
        }
    }
}
exports.AdoReporter = AdoReporter;
