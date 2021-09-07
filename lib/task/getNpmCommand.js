"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getNpmCommand(nodeArgs, passThroughArgs, task) {
    const extraArgs = passThroughArgs.length > 0 ? ["--", ...passThroughArgs] : [];
    return [...nodeArgs, "run", task, ...extraArgs];
}
exports.getNpmCommand = getNpmCommand;
