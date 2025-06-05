

import path from 'path';

import { getInputs, mergeInputs } from './input_utils.js';
import { saveJsonToFile } from './output_utils.js';

const animationOutputPath = path.join('..', 'outputs', 'animation_sequence.json');

async function generateAnimationSequence() {
    const { objectHierarchy, properties, assemblyData } = getInputs();
    const mergedInputs = await mergeInputs(objectHierarchy, properties, assemblyData);

    saveJsonToFile(mergedInputs, path.join('outputs', 'merged_data.json'));
}

export { generateAnimationSequence };