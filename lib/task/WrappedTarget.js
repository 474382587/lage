"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TaskLogger_1 = require("../logger/TaskLogger");
const abortSignal_1 = require("./abortSignal");
const backfill_1 = require("../cache/backfill");
const formatDuration_1 = require("../logger/reporters/formatDuration");
const taskId_1 = require("./taskId");
class WrappedTarget {
    constructor(target, root, config, context) {
        this.target = target;
        this.root = root;
        this.config = config;
        this.context = context;
        this.npmArgs = [];
        this.startTime = [0, 0];
        this.duration = [0, 0];
        this.status = "pending";
        this.logger = new TaskLogger_1.TaskLogger(target.packageName || "[GLOBAL]", target.packageName ? target.task : target.id);
        this.cacheOptions = Object.assign(Object.assign({}, config.cacheOptions), { outputGlob: [...(config.cacheOptions.outputGlob || []), ...(target.outputGlob || [])] });
        this.context.targets.set(target.id, this);
    }
    onStart() {
        this.status = "started";
        this.startTime = process.hrtime();
        this.logger.info("started", { status: "started" });
    }
    onComplete() {
        this.status = "completed";
        this.duration = process.hrtime(this.startTime);
        this.logger.info("completed", {
            status: "completed",
            duration: formatDuration_1.hrToSeconds(this.duration),
        });
    }
    onFail() {
        this.status = "failed";
        this.duration = process.hrtime(this.startTime);
        this.logger.info("failed", {
            status: "failed",
            duration: formatDuration_1.hrToSeconds(this.duration),
        });
    }
    onSkipped(hash) {
        this.status = "skipped";
        this.duration = process.hrtime(this.startTime);
        this.logger.info(`skipped`, {
            status: "skipped",
            duration: formatDuration_1.hrToSeconds(this.duration),
            hash,
        });
    }
    async getCache() {
        let hash = null;
        let cacheHit = false;
        const { target, root, config, cacheOptions } = this;
        if (config.cache) {
            hash = await backfill_1.cacheHash(target.id, target.cwd, root, cacheOptions, config.args);
            if (hash && !config.resetCache) {
                cacheHit = await backfill_1.cacheFetch(hash, target.id, target.cwd, cacheOptions);
            }
        }
        return { hash, cacheHit };
    }
    async saveCache(hash) {
        const { logger, target, cacheOptions } = this;
        logger.verbose(`hash put ${hash}`);
        await backfill_1.cachePut(hash, target.cwd, cacheOptions);
    }
    async run() {
        const { target, context, config, logger } = this;
        try {
            const { hash, cacheHit } = await this.getCache();
            const cacheEnabled = target.cache && config.cache && hash;
            this.onStart();
            // skip if cache hit!
            if (cacheHit) {
                this.onSkipped(hash);
                return true;
            }
            if (cacheEnabled) {
                logger.verbose(`hash: ${hash}, cache hit? ${cacheHit}`);
            }
            // Wraps with profiler as well as task args
            await context.profiler.run(() => {
                if (!target.run) {
                    return Promise.resolve();
                }
                let result;
                if (target.packageName) {
                    result = target.run({
                        packageName: target.packageName,
                        config: this.config,
                        cwd: target.cwd,
                        options: target.options,
                        taskName: taskId_1.getPackageAndTask(target.id).task,
                        logger,
                    });
                }
                else {
                    result = target.run({
                        config: this.config,
                        cwd: target.cwd,
                        options: target.options,
                        logger,
                    });
                }
                if (!result || typeof result["then"] !== "function") {
                    return Promise.resolve(result);
                }
                return result;
            }, target.id);
            if (cacheEnabled) {
                await this.saveCache(hash);
            }
            this.onComplete();
        }
        catch (e) {
            context.measures.failedTargets = context.measures.failedTargets || [];
            context.measures.failedTargets.push(target.id);
            this.onFail();
            if (config.continue) {
                return true;
            }
            if (!config.safeExit) {
                abortSignal_1.controller.abort();
            }
            return false;
        }
        return true;
    }
}
exports.WrappedTarget = WrappedTarget;
WrappedTarget.npmCmd = "";
WrappedTarget.activeProcesses = new Set();
WrappedTarget.gracefulKillTimeout = 2500;
