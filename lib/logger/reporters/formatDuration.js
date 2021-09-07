"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function formatDuration(seconds) {
    let raw = parseFloat(seconds);
    if (raw > 60) {
        const minutes = Math.floor(raw / 60);
        const seconds = (raw - minutes * 60).toFixed(2);
        return `${minutes}m ${seconds}s`;
    }
    else {
        const seconds = raw.toFixed(2);
        return `${seconds}s`;
    }
}
exports.formatDuration = formatDuration;
function hrToSeconds(hrtime) {
    let raw = hrtime[0] + hrtime[1] / 1e9;
    return raw.toFixed(2);
}
exports.hrToSeconds = hrToSeconds;
