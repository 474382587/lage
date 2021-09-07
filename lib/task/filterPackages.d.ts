import { PackageInfos } from "workspace-tools";
/**
 * Filters scopedPackages and changedPackages with option to calculate the transitive packages of all
 * @param options
 */
export declare function filterPackages(options: {
    allPackages: PackageInfos;
    deps: boolean;
    includeDependencies: boolean;
    scopedPackages: string[] | undefined;
    changedPackages: string[] | undefined;
}): string[];
