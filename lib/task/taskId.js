"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getTargetId(pkgName, task) {
    return `${pkgName}#${task}`;
}
exports.getTargetId = getTargetId;
function getPackageAndTask(targetId) {
    if (targetId.includes("#")) {
        const parts = targetId.split("#");
        return { packageName: parts[0], task: parts[1] };
    }
    else {
        return { packageName: undefined, task: targetId };
    }
}
exports.getPackageAndTask = getPackageAndTask;
