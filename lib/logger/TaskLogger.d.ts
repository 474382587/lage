import { Logger } from "./Logger";
import { TaskData } from "./LogEntry";
export declare class TaskLogger {
    private pkg;
    private task;
    logger: Logger;
    constructor(pkg: string, task: string);
    info(msg: string, data?: TaskData): void;
    warn(msg: string, data?: TaskData): void;
    error(msg: string, data?: TaskData): void;
    verbose(msg: string, data?: TaskData): void;
    silly(msg: string, data?: TaskData): void;
    getLogs(): import("./LogEntry").LogEntry[];
}
