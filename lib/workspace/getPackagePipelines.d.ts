import { PipelineDefinition } from "../types/PipelineDefinition";
import { PackageInfos } from "workspace-tools";
export declare function getPackagePipelines(allPackages: PackageInfos, defaultPipeline: PipelineDefinition): Map<string, PipelineDefinition>;
