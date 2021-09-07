import { Reporter } from "./Reporter";
import { LogLevel } from "../LogLevel";
import { LogEntry } from "../LogEntry";
import { RunContext } from "../../types/RunContext";
import { LoggerOptions } from "../../types/LoggerOptions";
export declare class NpmLogReporter implements Reporter {
    private options;
    readonly groupedEntries: Map<string, LogEntry[]>;
    constructor(options: {
        logLevel?: LogLevel;
        grouped?: boolean;
        npmLoggerOptions?: LoggerOptions;
    });
    log(entry: LogEntry): any;
    private logInfoEntry;
    private logGenericEntry;
    private logTaskEntry;
    private logTaskEntryInGroup;
    hr(): void;
    summarize(context: RunContext): void;
}
