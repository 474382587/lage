"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const workspace_tools_1 = require("workspace-tools");
const path_1 = __importDefault(require("path"));
function generateTopologicGraph(workspace) {
    const graph = {};
    const dependentMap = workspace_tools_1.getDependentMap(workspace.allPackages);
    for (const [pkg, info] of Object.entries(workspace.allPackages)) {
        const deps = dependentMap.get(pkg);
        graph[pkg] = {
            dependencies: [...(deps ? deps : [])],
            location: path_1.default.relative(workspace.root, path_1.default.dirname(info.packageJsonPath)),
        };
    }
    return graph;
}
exports.generateTopologicGraph = generateTopologicGraph;
