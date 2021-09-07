"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateTopologicalGraph_1 = require("../workspace/generateTopologicalGraph");
const NpmScriptTask_1 = require("./NpmScriptTask");
const p_graph_1 = __importDefault(require("p-graph"));
const path_1 = __importDefault(require("path"));
const getPipelinePackages_1 = require("./getPipelinePackages");
const taskId_1 = require("./taskId");
const WrappedTarget_1 = require("./WrappedTarget");
exports.START_TARGET_ID = "__start";
/**
 * Pipeline class represents lage's understanding of the dependency graphs and wraps the promise graph implementations to execute tasks in order
 */
class Pipeline {
    constructor(workspace, config) {
        this.workspace = workspace;
        this.config = config;
        /** Target represent a unit of work and the configuration of how to run it */
        this.targets = new Map([
            [
                exports.START_TARGET_ID,
                {
                    id: exports.START_TARGET_ID,
                    cwd: "",
                    run: () => { },
                    task: exports.START_TARGET_ID,
                    hidden: true,
                },
            ],
        ]);
        /** Target dependencies determine the run order of the targets  */
        this.dependencies = [];
        this.packageInfos = workspace.allPackages;
        this.graph = generateTopologicalGraph_1.generateTopologicGraph(workspace);
        this.loadConfig(config);
    }
    maybeRunNpmTask(task, info) {
        var _a;
        if (!((_a = info.scripts) === null || _a === void 0 ? void 0 : _a[task])) {
            return;
        }
        return (args) => {
            const npmTask = new NpmScriptTask_1.NpmScriptTask(task, info, this.config, args.logger);
            return npmTask.run();
        };
    }
    /**
     * Generates a package target during the expansion of the shortcut syntax
     */
    generatePackageTarget(packageName, task, deps) {
        const info = this.packageInfos[packageName];
        const id = taskId_1.getTargetId(packageName, task);
        return {
            id,
            task,
            cache: this.config.cache,
            outputGlob: this.config.cacheOptions.outputGlob,
            packageName: packageName,
            cwd: path_1.default.dirname(this.packageInfos[packageName].packageJsonPath),
            run: this.maybeRunNpmTask(task, info),
            // TODO: do we need to really merge this? Is this desired? (this is the OLD behavior)
            deps: this.targets.has(id) ? [...(this.targets.get(id).deps || []), ...deps] : deps,
        };
    }
    /**
     * Expands the shorthand notation to pipeline targets (executable units)
     */
    expandShorthandTargets(id, deps) {
        // shorthand gets converted to npm tasks
        const { packageName, task } = taskId_1.getPackageAndTask(id);
        const results = [];
        let packages = [];
        if (packageName) {
            // specific case in definition (e.g. 'package-name#test': ['build'])
            packages.push(packageName);
        }
        else {
            // generic case in definition (e.g. 'test': ['build'])
            packages = Object.entries(this.packageInfos).map(([pkg, _info]) => pkg);
        }
        for (const packageWithScript of packages) {
            results.push(this.generatePackageTarget(packageWithScript, task, deps));
        }
        return results;
    }
    /**
     * Given an id & factory, generate targets configurations
     * @param id
     * @param factory
     */
    generateFactoryTargets(factory) {
        const targets = factory({
            config: this.config,
            cwd: this.workspace.root,
        });
        return Array.isArray(targets) ? targets : [targets];
    }
    /**
     * Converts target configuration to pipeline target
     * @param id
     * @param target
     */
    convertToPipelineTarget(id, index, target) {
        if (target.type === "global") {
            return [
                Object.assign(Object.assign({}, target), { id: `${id}.${index}`, cache: target.cache !== false, cwd: this.workspace.root, task: id, run: target.run || (() => { }) }),
            ];
        }
        else {
            const packages = Object.entries(this.packageInfos);
            return packages.map(([pkg, _info]) => (Object.assign(Object.assign({}, target), { id: taskId_1.getTargetId(pkg, id), cache: target.cache !== false, task: id, cwd: path_1.default.dirname(this.packageInfos[pkg].packageJsonPath), packageName: pkg, run: target.run || this.maybeRunNpmTask(id, this.packageInfos[pkg]) })));
        }
    }
    /**
     * Adds a target definition (takes in shorthand, target config, or a target config factory)
     * @param id
     * @param targetDefinition
     */
    addTargetDefinition(id, targetDefinition) {
        // e.g. build: ["^build", "prepare"]
        if (Array.isArray(targetDefinition)) {
            const targets = this.expandShorthandTargets(id, targetDefinition);
            for (const target of targets) {
                this.targets.set(target.id, target);
            }
        }
        else {
            // e.g. build: { /* target config */ }
            const targets = typeof targetDefinition === "function" ? this.generateFactoryTargets(targetDefinition) : [targetDefinition];
            targets.forEach((target, index) => {
                const pipelineTargets = this.convertToPipelineTarget(id, index, target);
                for (const pipelineTarget of pipelineTargets) {
                    this.targets.set(pipelineTarget.id, pipelineTarget);
                }
            });
        }
    }
    /**
     * Adds all the target dependencies to the graph
     */
    addDependencies() {
        const targets = [...this.targets.values()];
        for (const target of targets) {
            const { deps, packageName, id } = target;
            // Always start with a root node with a special "START_TARGET_ID"
            this.dependencies.push([exports.START_TARGET_ID, id]);
            // Skip any targets that have no "deps" specified
            if (!deps || deps.length === 0) {
                continue;
            }
            /**
             * Now for every deps defined, we need to "interpret" it based on the syntax:
             * - for any deps like package#task, we simply add the singular dependency (source could be a single package or all packages)
             * - for anything that starts with a "^", we add the package-tasks according to the topological package graph
             *    NOTE: in a non-strict mode (TODO), the dependencies can come from transitive task dependencies
             * - for {"pkgA#task": ["dep"]}, we interpret to add "pkgA#dep"
             * - for anything that is a string without a "^", we treat that string as the name of a task, adding all targets that way
             *    NOTE: in a non-strict mode (TODO), the dependencies can come from transitive task dependencies
             *
             * We interpret anything outside of these conditions as invalid
             */
            for (const dep of deps) {
                if (dep.includes("#")) {
                    // package and task as deps
                    this.dependencies.push([dep, id]);
                }
                else if (dep.startsWith("^") && packageName) {
                    // topo dep -> build: ['^build']
                    const depTask = dep.substr(1);
                    const dependencyIds = targets
                        .filter((needle) => {
                        const { task, packageName: needlePackageName } = needle;
                        return (task === depTask && this.graph[packageName].dependencies.some((depPkg) => depPkg === needlePackageName));
                    })
                        .map((needle) => needle.id);
                    for (const dependencyId of dependencyIds) {
                        this.dependencies.push([dependencyId, id]);
                    }
                }
                else if (packageName) {
                    // Intra package task dependency - only add the target dependency if it exists in the pipeline targets lists
                    if (this.targets.has(taskId_1.getTargetId(packageName, dep))) {
                        this.dependencies.push([taskId_1.getTargetId(packageName, dep), target.id]);
                    }
                }
                else if (!dep.startsWith("^")) {
                    const dependencyIds = targets.filter((needle) => needle.task === dep).map((needle) => needle.id);
                    for (const dependencyId of dependencyIds) {
                        this.dependencies.push([dependencyId, id]);
                    }
                }
                else {
                    throw new Error(`invalid pipeline config detected: ${target.id}`);
                }
            }
        }
    }
    generateTargetGraph() {
        const scope = getPipelinePackages_1.getPipelinePackages(this.workspace, this.config);
        const tasks = this.config.command;
        const targetGraph = [];
        const queue = [];
        for (const task of tasks) {
            // package task
            for (const pkg of scope) {
                if (this.targets.has(taskId_1.getTargetId(pkg, task))) {
                    queue.push(taskId_1.getTargetId(pkg, task));
                    targetGraph.push([exports.START_TARGET_ID, taskId_1.getTargetId(pkg, task)]);
                }
            }
            // if we have globals, send those into the queue
            for (const target of this.targets.values()) {
                if (target.task === task && !target.packageName) {
                    queue.push(target.id);
                    targetGraph.push([exports.START_TARGET_ID, target.id]);
                }
            }
        }
        const visited = new Set();
        while (queue.length > 0) {
            const id = queue.shift();
            if (visited.has(id)) {
                continue;
            }
            visited.add(id);
            const { packageName, task } = taskId_1.getPackageAndTask(id);
            if (!packageName) {
                // global - find all deps in the form of "task.index"
                for (const [from, to] of this.dependencies) {
                    if (to.includes(".")) {
                        const toTaskName = to.split(".")[0];
                        if (toTaskName === task) {
                            targetGraph.push([from, to]);
                            if (from) {
                                queue.push(from);
                            }
                        }
                    }
                }
            }
            else {
                // package dep
                for (const [from, to] of this.dependencies) {
                    if (to === id) {
                        targetGraph.push([from, to]);
                        if (from) {
                            queue.push(from);
                        }
                    }
                }
            }
        }
        return targetGraph;
    }
    loadConfig(config) {
        this.config = config;
        for (const [id, targetDefinition] of Object.entries(this.config.pipeline)) {
            this.addTargetDefinition(id, targetDefinition);
        }
        // add target definitions for unknown tasks
        const knownTasks = new Set();
        for (const target of this.targets.values()) {
            knownTasks.add(target.task);
        }
        knownTasks.add(exports.START_TARGET_ID);
        const unknownCommands = this.config.command.filter((cmd) => !knownTasks.has(cmd));
        for (const command of unknownCommands) {
            this.addTargetDefinition(command, [`^${command}`]);
        }
        this.addDependencies();
    }
    getTargetPriority(target) {
        var _a, _b;
        return target.priority !== undefined
            ? target.priority
            : (_b = (_a = this.config.priorities) === null || _a === void 0 ? void 0 : _a.find((priority) => priority.package === target.packageName && priority.task === target.task)) === null || _b === void 0 ? void 0 : _b.priority;
    }
    async run(context) {
        const nodeMap = new Map();
        const targetGraph = this.generateTargetGraph();
        for (const [from, to] of targetGraph) {
            const fromTarget = this.targets.get(from);
            const toTarget = this.targets.get(to);
            for (const target of [fromTarget, toTarget]) {
                nodeMap.set(target.id, {
                    run: () => {
                        if (target.id === exports.START_TARGET_ID || !target.run) {
                            return Promise.resolve();
                        }
                        const wrappedTask = new WrappedTarget_1.WrappedTarget(target, this.workspace.root, this.config, context);
                        return wrappedTask.run();
                    },
                    priority: this.getTargetPriority(target),
                });
            }
        }
        await p_graph_1.default(nodeMap, targetGraph).run({
            concurrency: this.config.concurrency,
            continue: this.config.continue,
        });
    }
}
exports.Pipeline = Pipeline;
