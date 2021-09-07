"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const p_profiler_1 = __importDefault(require("p-profiler"));
const path_1 = require("path");
const os_1 = require("os");
const fs_1 = require("fs");
function createContext(config) {
    const { concurrency, profile } = config;
    const useCustomProfilePath = typeof profile === "string";
    const profilerOutputDir = useCustomProfilePath
        ? path_1.dirname(profile)
        : path_1.join(os_1.tmpdir(), "lage", "profiles");
    fs_1.mkdirSync(profilerOutputDir, { recursive: true });
    const profiler = new p_profiler_1.default(useCustomProfilePath
        ? {
            concurrency,
            customOutputPath: profile,
        }
        : {
            concurrency,
            prefix: "lage",
            outDir: profilerOutputDir,
        });
    return {
        measures: {
            start: [0, 0],
            duration: [0, 0],
            failedTargets: [],
        },
        targets: new Map(),
        profiler,
    };
}
exports.createContext = createContext;
