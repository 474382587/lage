import { Config } from "../types/Config";
import { PackageInfos } from "workspace-tools";
import { RunContext } from "../types/RunContext";
import { TargetConfig, TargetConfigFactory, TaskArgs } from "../types/PipelineDefinition";
import { TopologicalGraph } from "../types/TopologicalGraph";
import { Workspace } from "../types/Workspace";
/** individual targets to be kept track inside pipeline */
export interface PipelineTarget {
    id: string;
    packageName?: string;
    task: string;
    cwd: string;
    run?: (args: TaskArgs) => Promise<unknown> | void;
    deps?: string[];
    outputGlob?: string[];
    priority?: number;
    cache?: boolean;
    options?: any;
}
export declare const START_TARGET_ID = "__start";
/**
 * Pipeline class represents lage's understanding of the dependency graphs and wraps the promise graph implementations to execute tasks in order
 */
export declare class Pipeline {
    private workspace;
    private config;
    /** Target represent a unit of work and the configuration of how to run it */
    targets: Map<string, PipelineTarget>;
    /** Target dependencies determine the run order of the targets  */
    dependencies: [string, string][];
    /** Internal cache of the package.json information */
    packageInfos: PackageInfos;
    /** Internal generated cache of the topological package graph */
    graph: TopologicalGraph;
    constructor(workspace: Workspace, config: Config);
    private maybeRunNpmTask;
    /**
     * Generates a package target during the expansion of the shortcut syntax
     */
    private generatePackageTarget;
    /**
     * Expands the shorthand notation to pipeline targets (executable units)
     */
    private expandShorthandTargets;
    /**
     * Given an id & factory, generate targets configurations
     * @param id
     * @param factory
     */
    private generateFactoryTargets;
    /**
     * Converts target configuration to pipeline target
     * @param id
     * @param target
     */
    private convertToPipelineTarget;
    /**
     * Adds a target definition (takes in shorthand, target config, or a target config factory)
     * @param id
     * @param targetDefinition
     */
    addTargetDefinition(id: string, targetDefinition: string[] | TargetConfig | TargetConfigFactory): void;
    /**
     * Adds all the target dependencies to the graph
     */
    addDependencies(): void;
    generateTargetGraph(): [string, string][];
    loadConfig(config: Config): void;
    private getTargetPriority;
    run(context: RunContext): Promise<void>;
}
