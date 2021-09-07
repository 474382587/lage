"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const workspace_tools_1 = require("workspace-tools");
const logger_1 = require("../logger");
/**
 * Filters scopedPackages and changedPackages with option to calculate the transitive packages of all
 * @param options
 */
function filterPackages(options) {
    const { scopedPackages, changedPackages, allPackages, deps, includeDependencies, } = options;
    let filtered = [];
    // If scope is defined, use the transitive providers of the since packages up to the scope
    if (typeof scopedPackages !== "undefined" &&
        typeof changedPackages !== "undefined") {
        // If both scoped and since are specified, we have to merge two lists:
        // 1. changed packages that ARE themselves the scoped packages
        // 2. changed package consumers (package dependents) that are within the scoped subgraph
        filtered = changedPackages
            .filter((pkg) => scopedPackages.includes(pkg))
            .concat(workspace_tools_1.getTransitiveConsumers(changedPackages, allPackages, scopedPackages));
        logger_1.logger.verbose(`filterPackages changed within scope: ${filtered.join(",")}`);
    }
    else if (typeof changedPackages !== "undefined") {
        filtered = [...changedPackages];
        logger_1.logger.verbose(`filterPackages changed: ${changedPackages.join(",")}`);
    }
    else if (typeof scopedPackages !== "undefined") {
        filtered = [...scopedPackages];
        logger_1.logger.verbose(`filterPackages scope: ${scopedPackages.join(",")}`);
    }
    else {
        filtered = Object.keys(allPackages);
    }
    // adds dependents (consumers) of all filtered package thus far
    if (deps) {
        logger_1.logger.verbose(`filterPackages running with dependents`);
        filtered = filtered.concat(workspace_tools_1.getTransitiveConsumers(filtered, allPackages));
    }
    // adds dependencies of all filtered package thus far
    if (includeDependencies) {
        filtered = filtered.concat(workspace_tools_1.getTransitiveDependencies(filtered, allPackages));
    }
    const unique = new Set(filtered);
    return [...unique];
}
exports.filterPackages = filterPackages;
