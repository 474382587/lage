import { Workspace } from "../types/Workspace";
import { Config } from "../types/Config";
export declare function getWorkspace(cwd: string, config: Pick<Config, "since" | "ignore" | "npmClient">): Workspace;
