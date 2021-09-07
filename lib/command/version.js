"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../logger");
function version() {
    const lagePackageJson = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../../package.json'), 'utf-8'));
    logger_1.logger.info(lagePackageJson.version);
}
exports.version = version;
