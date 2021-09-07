"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const execa_1 = __importDefault(require("execa"));
async function init(cwd) {
    logger_1.logger.info("initialize lage with a default configuration file");
    let workspaceManager = "yarn";
    try {
        workspaceManager = whichWorkspaceManager(cwd);
    }
    catch (e) {
        logger_1.logger.error("lage requires you to be using a workspace - make sure you are using yarn workspaces, pnpm workspaces, or rush");
    }
    const pipeline = {
        build: ["^build"],
        test: ["build"],
        lint: [],
    };
    const lageConfig = {
        pipeline,
        npmClient: workspaceManager === "yarn" ? "yarn" : "npm",
    };
    const lageConfigFile = path_1.default.join(cwd, "lage.config.js");
    if (!fs_1.default.existsSync(lageConfigFile)) {
        fs_1.default.writeFileSync(lageConfigFile, "module.exports = " + JSON.stringify(lageConfig, null, 2) + ";");
    }
    installLage(cwd, workspaceManager);
    logger_1.logger.info(`Lage is initialized! You can now run: ${renderBuildCommand(workspaceManager)}`);
}
exports.init = init;
function renderBuildCommand(workspaceManager) {
    switch (workspaceManager) {
        case "yarn":
            return `yarn lage build`;
        case `pnpm`:
            return `pnpm run lage build`;
        case `rush`:
            return `npm run lage build`;
    }
}
function whichWorkspaceManager(cwd) {
    if (fs_1.default.existsSync(path_1.default.join(cwd, "rush.json"))) {
        return "rush";
    }
    if (fs_1.default.existsSync(path_1.default.join(cwd, "yarn.lock"))) {
        return "yarn";
    }
    if (fs_1.default.existsSync(path_1.default.join(cwd, "pnpm-workspace.yaml"))) {
        return "pnpm";
    }
    throw new Error("not a workspace");
}
async function installLage(cwd, workspaceManager) {
    const packageJson = readPackageJson(cwd);
    const lageVersion = getLageVersion();
    switch (workspaceManager) {
        case "yarn":
            packageJson.scripts = packageJson.scripts || {};
            packageJson.devDependencies = packageJson.devDependencies || {};
            packageJson.scripts.lage = "lage";
            packageJson.devDependencies.lage = lageVersion;
            writePackageJson(cwd, packageJson);
            await execa_1.default("yarn", {
                stdio: "inherit",
            });
            break;
        case "pnpm":
            packageJson.scripts = packageJson.scripts || {};
            packageJson.devDependencies = packageJson.devDependencies || {};
            packageJson.scripts.lage = "lage";
            packageJson.devDependencies.lage = lageVersion;
            writePackageJson(cwd, packageJson);
            await execa_1.default("pnpm", ["install"], { stdio: "inherit" });
            break;
        case "rush":
            packageJson.scripts = packageJson.scripts || {};
            packageJson.scripts.lage = `node common/scripts/install-run.js lage@${lageVersion} lage`;
            writePackageJson(cwd, packageJson);
            break;
    }
}
function getLageVersion() {
    const lagePackageJsonFile = require.resolve("../../package.json", {
        paths: [__dirname],
    });
    const lagePackageJson = JSON.parse(fs_1.default.readFileSync(lagePackageJsonFile, "utf-8"));
    return lagePackageJson.version;
}
function writePackageJson(cwd, packageJson) {
    const packageJsonFile = path_1.default.join(cwd, "package.json");
    fs_1.default.writeFileSync(packageJsonFile, JSON.stringify(packageJson, null, 2));
}
function readPackageJson(cwd) {
    const packageJsonFile = path_1.default.join(cwd, "package.json");
    return JSON.parse(fs_1.default.readFileSync(packageJsonFile, "utf-8"));
}
