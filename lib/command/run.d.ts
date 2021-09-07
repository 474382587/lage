import { Config } from "../types/Config";
import { Reporter } from "../logger/reporters/Reporter";
/**
 * Prepares and runs a pipeline
 * @param cwd
 * @param config
 * @param reporters
 */
export declare function run(cwd: string, config: Config, reporters: Reporter[]): Promise<void>;
