"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_parser_1 = __importDefault(require("yargs-parser"));
function arrifyArgs(args) {
    const argsArray = [];
    for (const [key, val] of Object.entries(args)) {
        if (key === "--" && Array.isArray(val)) {
            val.forEach((arg) => argsArray.push(arg));
        }
        else if (Array.isArray(val)) {
            for (const item of val) {
                pushValue(key, item);
            }
        }
        else {
            pushValue(key, val);
        }
    }
    return argsArray;
    function pushValue(key, value) {
        let keyArg = "";
        if (typeof value === "boolean") {
            if (key.length === 1 && value) {
                keyArg = `-${key}`;
            }
            else if (value) {
                keyArg = `--${key}`;
            }
            else {
                keyArg = `--no-${key}`;
            }
            argsArray.push(keyArg);
        }
        else {
            if (key.length === 1 && value) {
                keyArg = `-${key}`;
            }
            else if (value) {
                keyArg = `--${key}`;
            }
            argsArray.push(keyArg, value);
        }
    }
}
exports.arrifyArgs = arrifyArgs;
function getPassThroughArgs(command, args) {
    let result = [];
    let lageArgs = [
        "node",
        "scope",
        "since",
        "cache",
        "deps",
        "resetCache",
        "ignore",
        "verbose",
        "only",
        "concurrency",
        "profile",
        "grouped",
        "reporter",
        "to",
        "parallel",
        "continue",
        "safeExit",
        "includeDependencies",
        "logLevel",
        "cacheKey",
        "_",
    ];
    if (command[0] === "cache") {
        lageArgs = [...lageArgs, "clear", "prune"];
    }
    const filtered = {};
    for (let [key, value] of Object.entries(args)) {
        if (!lageArgs.includes(key)) {
            filtered[key] = value;
        }
    }
    result = result.concat(arrifyArgs(filtered));
    return result;
}
exports.getPassThroughArgs = getPassThroughArgs;
function parseArgs() {
    return yargs_parser_1.default(process.argv.slice(2), {
        array: ["scope", "node", "ignore", "to"],
        configuration: {
            "populate--": true,
            "strip-dashed": true,
        },
        string: ["cacheKey"],
    });
}
exports.parseArgs = parseArgs;
function validateInput(parsedArgs) {
    return parsedArgs._ && parsedArgs._.length > 0;
}
exports.validateInput = validateInput;
