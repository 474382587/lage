"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const filterPackages_1 = require("./filterPackages");
const workspace_tools_1 = require("workspace-tools");
const fg = __importStar(require("fast-glob"));
const logger_1 = require("../logger");
function getPipelinePackages(workspace, config) {
    const { scope, since, repoWideChanges, includeDependencies } = config;
    // If scoped is defined, get scoped packages
    const hasScopes = Array.isArray(scope) && scope.length > 0;
    let scopedPackages = undefined;
    if (hasScopes) {
        scopedPackages = workspace_tools_1.getScopedPackages(scope, workspace.allPackages);
    }
    const hasSince = typeof since !== "undefined";
    let changedPackages = undefined;
    // Be specific with the changed packages only if no repo-wide changes occurred
    if (hasSince && !hasRepoChanged(since, workspace.root, repoWideChanges)) {
        try {
            changedPackages = workspace_tools_1.getChangedPackages(workspace.root, since, config.ignore);
        }
        catch (e) {
            logger_1.logger.warn(`An error in the git command has caused this scope run to include every package\n${e}`);
            // if getChangedPackages throws, we will assume all have changed (using changedPackage = undefined)
        }
    }
    return filterPackages_1.filterPackages({
        allPackages: workspace.allPackages,
        deps: config.deps,
        scopedPackages,
        changedPackages,
        includeDependencies,
    });
}
exports.getPipelinePackages = getPipelinePackages;
function hasRepoChanged(since, root, environmentGlob) {
    try {
        const changedFiles = workspace_tools_1.getBranchChanges(since, root);
        const envFiles = fg.sync(environmentGlob, { cwd: root });
        let repoWideChanged = false;
        if (changedFiles) {
            for (const change of changedFiles) {
                if (envFiles.includes(change)) {
                    repoWideChanged = true;
                    break;
                }
            }
        }
        return repoWideChanged;
    }
    catch (e) {
        // if this fails, let's assume repo has changed
        logger_1.logger.warn(`An error in the git command has caused this to consider the repo has changed\n${e}`);
        return true;
    }
}
