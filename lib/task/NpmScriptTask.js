"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const findNpmClient_1 = require("../workspace/findNpmClient");
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const TaskLogWritable_1 = require("../logger/TaskLogWritable");
const getNpmCommand_1 = require("./getNpmCommand");
class NpmScriptTask {
    constructor(task, info, config, logger) {
        this.task = task;
        this.info = info;
        this.config = config;
        this.logger = logger;
        this.npmArgs = [];
        this.startTime = [0, 0];
        this.duration = [0, 0];
        NpmScriptTask.npmCmd = NpmScriptTask.npmCmd || findNpmClient_1.findNpmClient(config.npmClient);
        this.status = "pending";
        this.npmArgs = getNpmCommand_1.getNpmCommand(config.node, config.args, task);
    }
    static killAllActiveProcesses() {
        // first, send SIGTERM everywhere
        for (const cp of NpmScriptTask.activeProcesses) {
            cp.kill("SIGTERM");
        }
        // wait for "gracefulKillTimeout" to make sure everything is terminated via SIGKILL
        setTimeout(() => {
            for (const cp of NpmScriptTask.activeProcesses) {
                if (!cp.killed) {
                    cp.kill("SIGKILL");
                }
            }
        }, NpmScriptTask.gracefulKillTimeout);
    }
    run() {
        const { info, logger, npmArgs } = this;
        const { npmCmd } = NpmScriptTask;
        return new Promise((resolve, reject) => {
            logger.verbose(`Running ${[npmCmd, ...npmArgs].join(" ")}`);
            const cp = child_process_1.spawn(npmCmd, npmArgs, {
                cwd: path_1.default.dirname(info.packageJsonPath),
                stdio: "pipe",
                env: Object.assign(Object.assign(Object.assign({}, process.env), (process.stdout.isTTY && this.config.reporter !== "json" && { FORCE_COLOR: "1" })), { LAGE_PACKAGE_NAME: info.name }),
            });
            NpmScriptTask.activeProcesses.add(cp);
            const stdoutLogger = new TaskLogWritable_1.TaskLogWritable(this.logger);
            cp.stdout.pipe(stdoutLogger);
            const stderrLogger = new TaskLogWritable_1.TaskLogWritable(this.logger);
            cp.stderr.pipe(stderrLogger);
            cp.on("exit", handleChildProcessExit);
            function handleChildProcessExit(code) {
                if (code === 0) {
                    NpmScriptTask.activeProcesses.delete(cp);
                    return resolve();
                }
                cp.stdout.destroy();
                cp.stdin.destroy();
                reject();
            }
        });
    }
}
exports.NpmScriptTask = NpmScriptTask;
NpmScriptTask.npmCmd = "";
NpmScriptTask.activeProcesses = new Set();
NpmScriptTask.gracefulKillTimeout = 2500;
