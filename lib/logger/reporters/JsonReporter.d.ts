import { Reporter } from "./Reporter";
import { LogEntry } from "../LogEntry";
import { LogLevel } from "../LogLevel";
import { RunContext } from "../../types/RunContext";
export declare class JsonReporter implements Reporter {
    private options;
    constructor(options: {
        logLevel: LogLevel;
    });
    log(entry: LogEntry): void;
    summarize(context: RunContext): void;
}
