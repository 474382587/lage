/// <reference types="node" />
import { TaskLogger } from "../logger/TaskLogger";
import { ChildProcess } from "child_process";
import { RunContext } from "../types/RunContext";
import { PipelineTarget } from "./Pipeline";
import { Config } from "../types/Config";
import { CacheOptions } from "../types/CacheOptions";
export declare type TargetStatus = "completed" | "failed" | "pending" | "started" | "skipped";
export declare class WrappedTarget {
    target: PipelineTarget;
    private root;
    private config;
    private context;
    static npmCmd: string;
    static activeProcesses: Set<ChildProcess>;
    static gracefulKillTimeout: number;
    npmArgs: string[];
    startTime: [number, number];
    duration: [number, number];
    status: TargetStatus;
    logger: TaskLogger;
    cacheOptions: CacheOptions;
    constructor(target: PipelineTarget, root: string, config: Config, context: RunContext);
    onStart(): void;
    onComplete(): void;
    onFail(): void;
    onSkipped(hash: string | null): void;
    getCache(): Promise<{
        hash: string | null;
        cacheHit: boolean;
    }>;
    saveCache(hash: string | null): Promise<void>;
    run(): Promise<boolean>;
}
