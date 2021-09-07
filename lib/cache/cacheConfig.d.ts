import { CacheOptions } from "../types/CacheOptions";
export declare function getCacheConfig(cwd: string, cacheOptions: CacheOptions): {
    cacheStorageConfig: import("backfill-config").CacheStorageConfig;
    clearOutput: boolean;
    internalCacheFolder: string;
    logFolder: string;
    logLevel: "verbose" | "silly" | "info" | "warn" | "error" | "mute";
    name: string;
    mode: "READ_ONLY" | "WRITE_ONLY" | "READ_WRITE" | "PASS";
    outputGlob: string[];
    packageRoot: string;
    performanceReportName?: string | undefined;
    producePerformanceLogs: boolean;
    validateOutput: boolean;
    environmentGlob: string[];
    cacheKey: string;
};
