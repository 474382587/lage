import { getPackageAndTask } from "../../task/taskId";
import { RunContext } from "../../types/RunContext";
// import { LogEntry } from "../LogEntry";
import { Reporter } from "./Reporter";

export class AdoReporter implements Reporter {
    summarize(context: RunContext) {
        const { measures, targets } = context
        if (measures.failedTargets && measures.failedTargets.length > 0) {
            let msg = ``;
            for (const failedTargetId of measures.failedTargets) {
                const { packageName, task } = getPackageAndTask(failedTargetId);
                const taskLogs = targets.get(failedTargetId)?.logger.getLogs();

                msg += `package: ${packageName}  |  task: ${task} | error?: `

                if (taskLogs) {
                    for (let i = 0; i < taskLogs.length; i += 1) {
                        if (taskLogs[i].msg.includes('\n')) {
                            msg += taskLogs[i].msg.replace('\n', '')
                            break
                        }
                    }
                }
            }

            console.log(`##vso[task.logissue type=error]${msg}`)
        }
    }
}