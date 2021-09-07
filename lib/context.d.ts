import { Config } from "./types/Config";
import { RunContext } from "./types/RunContext";
export declare function createContext(config: Pick<Config, "concurrency" | "profile">): RunContext;
