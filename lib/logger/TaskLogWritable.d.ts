/// <reference types="node" />
import { Writable } from "stream";
import { TaskLogger } from "./TaskLogger";
export declare class TaskLogWritable extends Writable {
    private taskLogger;
    private buffer;
    constructor(taskLogger: TaskLogger);
    _write(chunk: Buffer, _encoding: string, callback: (error?: Error | null) => void): void;
}
