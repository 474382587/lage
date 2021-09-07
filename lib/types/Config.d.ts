import { ConfigOptions } from "./ConfigOptions";
import { CliOptions } from "./CliOptions";
interface InternalConfigOptions {
    /** calculated */
    args: any;
}
export declare type Config = InternalConfigOptions & ConfigOptions & CliOptions;
export {};
