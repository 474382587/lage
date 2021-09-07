import { Config as BackfillCacheOptions } from "backfill-config";
export declare type CacheOptions = BackfillCacheOptions & {
    environmentGlob: string[];
    cacheKey: string;
};
