"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * Starting from `cwd`, searches up the directory hierarchy for `pathName`
 * @param pathName
 * @param cwd
 */
function searchUp(pathName, cwd) {
    const root = path_1.default.parse(cwd).root;
    let found = false;
    while (!found && cwd !== root) {
        if (fs_1.default.existsSync(path_1.default.join(cwd, pathName))) {
            found = true;
            break;
        }
        cwd = path_1.default.dirname(cwd);
    }
    if (found) {
        return cwd;
    }
    return null;
}
exports.searchUp = searchUp;
function findPackageRoot(cwd) {
    return searchUp("package.json", cwd);
}
exports.findPackageRoot = findPackageRoot;
function isChildOf(child, parent) {
    const relativePath = path_1.default.relative(child, parent);
    return /^[.\/\\]+$/.test(relativePath);
}
exports.isChildOf = isChildOf;
