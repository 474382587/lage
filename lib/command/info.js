"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger");
const getWorkspace_1 = require("../workspace/getWorkspace");
const getPipelinePackages_1 = require("../task/getPipelinePackages");
const path_1 = __importDefault(require("path"));
const getNpmCommand_1 = require("../task/getNpmCommand");
const Pipeline_1 = require("../task/Pipeline");
const taskId_1 = require("../task/taskId");
/**
 * Generates a graph and spit it out in stdout
 *
 * Expected format:
 * [
 *   {
 *       "id": "bar##build",
 *       "package": "bar",
 *       "task": "build",
 *       "command": "npm run build --blah",
 *       "workingDirectory": "packages/bar",
 *       "dependencies": []
 *   },
 *   {
 *       "id": "foo##build",
 *       "package": "foo",
 *       "task": "build",
 *       "command": "npm run build --blah",
 *       "workingDirectory": "packages/foo",
 *       "dependencies": [
 *           "bar##build"
 *       ]
 *   },
 *   {
 *       "id": "foo##test",
 *       "package": "foo",
 *       "task": "test",
 *       "command": "npm run test --blah",
 *       "workingDirectory": "packages/foo",
 *       "dependencies": [
 *           "foo##build"
 *       ]
 *   },
 *   ...
 * ]
 */
async function info(cwd, config) {
    const workspace = getWorkspace_1.getWorkspace(cwd, config);
    const packages = getPipelinePackages_1.getPipelinePackages(workspace, config);
    const pipeline = new Pipeline_1.Pipeline(workspace, config);
    const targetGraph = pipeline.generateTargetGraph();
    const packageTasks = new Map();
    for (const [from, to] of targetGraph) {
        for (const id of [from, to]) {
            if (!packageTasks.has(id)) {
                const packageTaskInfo = createPackageTaskInfo(id, config, workspace);
                if (packageTaskInfo && id !== Pipeline_1.START_TARGET_ID) {
                    packageTasks.set(id, packageTaskInfo);
                }
            }
        }
        if (packageTasks.has(to) && from !== Pipeline_1.START_TARGET_ID) {
            packageTasks.get(to).dependencies.push(from);
        }
    }
    logger_1.logger.info(`info`, {
        command: config.command.slice(1),
        scope: packages,
        packageTasks: [...packageTasks.values()],
    });
}
exports.info = info;
function createPackageTaskInfo(id, config, workspace) {
    var _a;
    const { packageName, task } = taskId_1.getPackageAndTask(id);
    if (packageName) {
        const info = workspace.allPackages[packageName];
        if (!!((_a = info.scripts) === null || _a === void 0 ? void 0 : _a[task])) {
            return {
                id,
                command: [config.npmClient, ...getNpmCommand_1.getNpmCommand(config.node, config.args, task)],
                dependencies: [],
                workingDirectory: path_1.default
                    .relative(workspace.root, path_1.default.dirname(workspace.allPackages[packageName].packageJsonPath))
                    .replace(/\\/g, "/"),
                package: packageName,
                task,
            };
        }
    }
    else {
        return {
            id,
            command: ["echo", `"global script ${id}"`],
            dependencies: [],
            workingDirectory: ".",
            package: undefined,
            task,
        };
    }
}
