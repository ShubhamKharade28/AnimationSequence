import fs from 'fs';
import path from 'path';

/**
 * Saves a JSON object to a file.
 * @param {Object} data - The JSON object to save.
 * @param {string} filename - The filename (with or without .json extension).
 * @param {string} [dir] - Optional directory to save the file in (default: current directory).
 */
function saveJsonToFile(data, filename, dir = '.') {
    const file = filename.endsWith('.json') ? filename : `${filename}.json`;
    const filePath = path.join(dir, file);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Saved JSON to ${filePath}`);
}

export { saveJsonToFile };