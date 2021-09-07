import yargsParser, { Arguments } from "yargs-parser";
export declare function arrifyArgs(args: {
    [key: string]: string | string[];
}): string[];
export declare function getPassThroughArgs(command: string[], args: {
    [key: string]: string | string[];
}): string[];
export declare function parseArgs(): yargsParser.Arguments;
export declare function validateInput(parsedArgs: Arguments): boolean;
