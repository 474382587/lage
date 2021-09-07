"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./Logger");
class TaskLogger {
    constructor(pkg, task) {
        this.pkg = pkg;
        this.task = task;
        this.logger = new Logger_1.Logger();
    }
    info(msg, data) {
        this.logger.info(msg, Object.assign({ package: this.pkg, task: this.task }, data));
    }
    warn(msg, data) {
        this.logger.warn(msg, Object.assign({ package: this.pkg, task: this.task }, data));
    }
    error(msg, data) {
        this.logger.error(msg, Object.assign({ package: this.pkg, task: this.task }, data));
    }
    verbose(msg, data) {
        this.logger.verbose(msg, Object.assign({ package: this.pkg, task: this.task }, data));
    }
    silly(msg, data) {
        this.logger.silly(msg, Object.assign({ package: this.pkg, task: this.task }, data));
    }
    getLogs() {
        return this.logger.logs;
    }
}
exports.TaskLogger = TaskLogger;
