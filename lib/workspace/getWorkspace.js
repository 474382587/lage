"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const workspace_tools_1 = require("workspace-tools");
const findNpmClient_1 = require("./findNpmClient");
function getWorkspace(cwd, config) {
    const root = workspace_tools_1.getWorkspaceRoot(cwd);
    if (!root) {
        throw new Error("This must be called inside a codebase that is part of a JavaScript workspace.");
    }
    const { npmClient } = config;
    const allPackages = workspace_tools_1.getPackageInfos(root);
    const npmCmd = findNpmClient_1.findNpmClient(npmClient);
    return {
        root,
        allPackages,
        npmClient,
        npmCmd,
    };
}
exports.getWorkspace = getWorkspace;
