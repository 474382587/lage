export declare function getTargetId(pkgName: string, task: string): string;
export declare function getPackageAndTask(targetId: string): {
    packageName: string;
    task: string;
} | {
    packageName: undefined;
    task: string;
};
