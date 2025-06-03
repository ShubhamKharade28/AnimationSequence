
const { exec, execFile } = require('child_process');
const path = require('path');
const fs = require('fs');
const { logError } = require('./log_error');

const inventorExporterPath = path.join(__dirname, 'inventor', 'InventorExporterAlgo.exe');
const modelDerivativeApiPath = path.join(__dirname, 'model_derivative_api', 'main.py');
const assembly_file = "scissors.iam";

async function runInventorExporter() {
    let assembly_file_path = path.join(__dirname, 'upload', assembly_file);
    let output_file_path = path.join(__dirname, 'inputs', 'assembly_data.json');

    return new Promise((resolve, reject) => {
        execFile(
            inventorExporterPath,
            [assembly_file_path, output_file_path],
            (error, stdout, stderr) => {
                if (error) {
                    logError(`InventorExporterAlgo error: ${error.message}`, 'inventor_exporter_error.log');
                    reject(error);
                    return;
                }
                if (stderr) {
                    logError(`InventorExporterAlgo stderr: ${stderr}`, 'inventor_exporter_error.log');
                }
                console.log(`InventorExporterAlgo stdout: ${stdout}`);
                resolve();
            }
        );
    });
}

async function runModelDerivativeApi() {
    let command = `python "${modelDerivativeApiPath}" "${assembly_file}"`;

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                logError(`Model Derivative API error: ${error.message}`, 'model_derivative_api_error.log');
                reject(error);
                return;
            }
            if (stderr) {
                logError(`Model Derivative API stderr: ${stderr}`, 'model_derivative_api_error.log');
            }
            console.log(`Model Derivative API stdout: ${stdout}`);
            resolve();
        });
    });
}

async function moveModelDerivativeResults() {
    const sourceDir = path.join(__dirname, 'responses');
    const targetDir = path.join(__dirname, 'inputs');

    // Ensure the target directory exists
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    // Check source directory and files
    if (!fs.existsSync(sourceDir)) {
        const msg = `Source directory does not exist: ${sourceDir}`;
        logError(msg, 'move_model_derivative_results_error.log');
        
        throw new Error(msg);
    }

    const srcObjHierarchy = path.join(sourceDir, '09_object_hierarchy.json');
    const srcProperties = path.join(sourceDir, '10_properties_all_objects.json');
    if (!fs.existsSync(srcObjHierarchy) || !fs.existsSync(srcProperties)) {
        const msg = `Required files do not exist in source directory: ${sourceDir}`;
        logError(msg, 'move_model_derivative_results_error.log');
        throw new Error(msg);
    }

    try {
        fs.copyFileSync(srcObjHierarchy, path.join(targetDir, 'object_hierarchy.json'));
        fs.copyFileSync(srcProperties, path.join(targetDir, 'properties.json'));
        console.log("Moved object_hierarchy.json and properties.json to inputs/");
    } catch (error) {
        logError(`Error moving files: ${error.message}`, 'move_model_derivative_results_error.log');
        throw error;
    }
}

module.exports = {
    runInventorExporter,
    runModelDerivativeApi,
    moveModelDerivativeResults
};