import { CacheOptions } from "../types/CacheOptions";
export declare function cacheHash(id: string, cwd: string, root: string, cacheOptions: CacheOptions, args: any): Promise<string | null>;
export declare function cacheFetch(hash: string | null, id: string, cwd: string, cacheOptions: CacheOptions): Promise<boolean>;
export declare function cachePut(hash: string | null, cwd: string, cacheOptions: CacheOptions): Promise<void>;
