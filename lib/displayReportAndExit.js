"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function displayReportAndExit(reporters, context) {
    context.measures.duration = process.hrtime(context.measures.start);
    for (const reporter of reporters) {
        reporter.summarize(context);
    }
    if (context.measures.failedTargets && context.measures.failedTargets.length > 0) {
        process.exit(1);
    }
}
exports.displayReportAndExit = displayReportAndExit;
