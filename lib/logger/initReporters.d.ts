import { Config } from "../types/Config";
import { NpmLogReporter } from "./reporters/NpmLogReporter";
import { JsonReporter } from "./reporters/JsonReporter";
import { AdoReportor } from "./reporters/AdoReporter";
export declare function initReporters(config: Config): (NpmLogReporter | JsonReporter | AdoReportor)[];
