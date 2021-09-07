/// <reference types="node" />
import { TaskLogger } from "../logger/TaskLogger";
import { ChildProcess } from "child_process";
import { PackageInfo } from "workspace-tools";
import { Config } from "../types/Config";
export declare type NpmScriptTaskStatus = "completed" | "failed" | "pending" | "started" | "skipped";
export declare class NpmScriptTask {
    task: string;
    info: PackageInfo;
    private config;
    private logger;
    static npmCmd: string;
    static activeProcesses: Set<ChildProcess>;
    static gracefulKillTimeout: number;
    npmArgs: string[];
    startTime: [number, number];
    duration: [number, number];
    status: NpmScriptTaskStatus;
    static killAllActiveProcesses(): void;
    constructor(task: string, info: PackageInfo, config: Config, logger: TaskLogger);
    run(): Promise<void>;
}
