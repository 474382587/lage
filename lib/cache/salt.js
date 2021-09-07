"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const fg = __importStar(require("fast-glob"));
const fs = __importStar(require("fs"));
const os_1 = __importDefault(require("os"));
const process_1 = __importDefault(require("process"));
let envHash;
function salt(environmentGlobFiles, command, repoRoot, customKey = "") {
    return hashStrings([
        ...getEnvHash(environmentGlobFiles, repoRoot),
        os_1.default.platform(),
        process_1.default.version,
        command,
        customKey,
    ]);
}
exports.salt = salt;
function getEnvHash(environmentGlobFiles, repoRoot) {
    if (!envHash) {
        const newline = /\r\n|\r|\n/g;
        const LF = "\n";
        const files = fg.sync(environmentGlobFiles, {
            cwd: repoRoot,
        });
        files.sort((a, b) => a.localeCompare(b));
        const hashes = files.map((file) => {
            const hasher = crypto.createHash("sha1");
            hasher.update(file);
            const fileBuffer = fs.readFileSync(path.join(repoRoot, file));
            const data = fileBuffer.toString().replace(newline, LF);
            hasher.update(data);
            return hasher.digest("hex");
        });
        envHash = hashes;
    }
    return envHash;
}
function hashStrings(strings) {
    const hasher = crypto.createHash("sha1");
    const anArray = typeof strings === "string" ? [strings] : strings;
    const elements = [...anArray];
    elements.sort((a, b) => a.localeCompare(b));
    elements.forEach((element) => hasher.update(element));
    return hasher.digest("hex");
}
