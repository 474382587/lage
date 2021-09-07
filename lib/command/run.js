"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getWorkspace_1 = require("../workspace/getWorkspace");
const logger_1 = require("../logger");
const abortSignal_1 = require("../task/abortSignal");
const displayReportAndExit_1 = require("../displayReportAndExit");
const context_1 = require("../context");
const NpmScriptTask_1 = require("../task/NpmScriptTask");
const Pipeline_1 = require("../task/Pipeline");
/**
 * Prepares and runs a pipeline
 * @param cwd
 * @param config
 * @param reporters
 */
async function run(cwd, config, reporters) {
    const context = context_1.createContext(config);
    const workspace = getWorkspace_1.getWorkspace(cwd, config);
    const { profiler } = context;
    let aborted = false;
    context.measures.start = process.hrtime();
    // die faster if an abort signal is seen
    abortSignal_1.signal.addEventListener("abort", () => {
        aborted = true;
        NpmScriptTask_1.NpmScriptTask.killAllActiveProcesses();
        displayReportAndExit_1.displayReportAndExit(reporters, context);
    });
    try {
        const pipeline = new Pipeline_1.Pipeline(workspace, config);
        await pipeline.run(context);
    }
    catch (e) {
        logger_1.logger.error("runTasks: " + (e.stack || e.message || e));
        process.exitCode = 1;
    }
    if (config.profile) {
        try {
            const profileFile = profiler.output();
            logger_1.logger.info(`runTasks: Profile saved to ${profileFile}`);
        }
        catch (e) {
            logger_1.logger.error(`An error occured while trying to write profile: ${e.message}`);
            process.exitCode = 1;
        }
    }
    if (!aborted) {
        displayReportAndExit_1.displayReportAndExit(reporters, context);
    }
}
exports.run = run;
