const fs = require('fs');
const path = require('path');

/**
 * Logs an error message to a file in the logs directory.
 * @param {string} message - The error message to log.
 * @param {string} [filename] - Optional log filename. If not provided, uses the caller function name and current date.
 */
function logError(message, filename) {
    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }

    let logFile;
    if (filename) {
        logFile = path.join(logsDir, filename);
    } else {
        // Get the caller function name from the stack trace
        const stack = new Error().stack.split('\n');
        let caller = 'unknown';
        if (stack.length > 2) {
            const match = stack[2].match(/at (\w+)/);
            if (match) caller = match[1];
        }
        const date = new Date().toISOString().slice(0, 10);
        logFile = path.join(logsDir, `${caller}_${date}.log`);
    }

    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(logFile, logEntry, 'utf8');
}

module.exports = { logError };
