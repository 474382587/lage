"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function findNpmClient(npmClient) {
    const found = findInPath(npmClient);
    if (!found) {
        throw new Error(`npm client not found: ${npmClient}`);
    }
    return found;
}
exports.findNpmClient = findNpmClient;
function findInPath(target) {
    var _a, _b;
    const envPath = (_a = process.env.PATH) !== null && _a !== void 0 ? _a : "";
    const pathExt = (_b = process.env.PATHEXT) !== null && _b !== void 0 ? _b : "";
    for (const search of envPath.split(path_1.default.delimiter)) {
        const found = pathExt
            .split(path_1.default.delimiter)
            .map((ext) => path_1.default.join(search, `${target}${ext}`))
            .find((p) => fs_1.default.existsSync(p));
        if (found) {
            return found;
        }
    }
}
exports.findInPath = findInPath;
