"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
class TaskLogWritable extends stream_1.Writable {
    constructor(taskLogger) {
        super();
        this.taskLogger = taskLogger;
        this.buffer = "";
    }
    _write(chunk, _encoding, callback) {
        let prev = 0;
        let curr = 0;
        while (curr < chunk.byteLength) {
            if (chunk[curr] === 13 || (chunk[curr] === 10 && curr - prev > 1)) {
                this.buffer =
                    this.buffer +
                        chunk
                            .slice(prev, curr)
                            .toString()
                            .replace(/^(\r\n|\n|\r)|(\r\n|\n|\r)$/g, "")
                            .trimRight();
                this.taskLogger.verbose(this.buffer);
                this.buffer = "";
                prev = curr;
            }
            curr++;
        }
        callback();
    }
}
exports.TaskLogWritable = TaskLogWritable;
