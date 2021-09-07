import { LogEntry, LogStructuredData } from "./LogEntry";
import { LogLevel } from "./LogLevel";
import { Reporter } from "./reporters/Reporter";
export declare class Logger {
    static reporters: Reporter[];
    logs: LogEntry[];
    log(level: LogLevel, msg: string, data?: LogStructuredData): void;
    info(msg: string, data?: LogStructuredData): void;
    warn(msg: string, data?: LogStructuredData): void;
    error(msg: string, data?: LogStructuredData): void;
    verbose(msg: string, data?: LogStructuredData): void;
    silly(msg: string, data?: LogStructuredData): void;
}
