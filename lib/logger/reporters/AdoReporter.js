"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const taskId_1 = require("../../task/taskId");
class AdoReportor {
    summarize(context) {
        var _a;
        const { measures, targets } = context;
        if (measures.failedTargets && measures.failedTargets.length > 0) {
            let msg = ``;
            for (const failedTargetId of measures.failedTargets) {
                const { packageName, task } = taskId_1.getPackageAndTask(failedTargetId);
                const taskLogs = (_a = targets.get(failedTargetId)) === null || _a === void 0 ? void 0 : _a.logger.getLogs();
                msg += `package: ${packageName}  |  task: ${task} | error?: `;
                if (taskLogs) {
                    // msg += `${taskLogs?.map((entry) => entry.msg).join("\n")}`
                    for (let i = 0; i < taskLogs.length; i += 1) {
                        if (taskLogs[i].msg.includes('\n')) {
                            msg += taskLogs[i].msg.replace('\n', '');
                            break;
                        }
                    }
                }
            }
            console.log(`##vso[task.logissue type=error]${msg}`);
        }
    }
}
exports.AdoReportor = AdoReportor;
