import path from 'path';
import fs from 'fs';
import { model } from './langchain_setup.js';

import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { JsonOutputParser } from '@langchain/core/output_parsers';

function getInputs() {
    // returns [objectHierarchy, properties, assemblyData]
    const [objectHierarchy, properties, assemblyData] = [
        path.join('inputs', 'object_hierarchy.json'),
        path.join('inputs', 'properties.json'),
        path.join('inputs', 'assembly_data.json')
    ].map(filePath => JSON.parse(fs.readFileSync(filePath, 'utf-8')));

    return {objectHierarchy, properties, assemblyData};
}

async function integrateInputs(objectHierarchy, properties, assemblyData) {
    const prompt = ChatPromptTemplate.fromTemplate(
    `
You are an expert JSON integrator. Merge the following three inputs: objectHierarchy, properties, and assemblyData.

Your task:
- Each component should become a "fragment" with a unique fragmentId.
- Do not include any geometry (e.g., transformationMatrix).
- Maintain constraints and joints correctly between two fragments.
- If possible, include the face/edge references using objectHierarchy.
- Merge metadata from properties into each fragment.
- Keep output short and clean, while preserving essential relationships and identifiers.

Output a single JSON object with structure:
{{
  "fragments": [...],
  "constraints": [...],
  "joints": [...]
}}

Here is the data:
objectHierarchy: {objectHierarchy}
properties: {properties}
assemblyData: {assemblyData}
`.trim()
  );

  const jsonChain = RunnableSequence.from([
    prompt,
    model,
    new JsonOutputParser(),
  ]);

  const mergedData = await jsonChain.invoke({
    objectHierarchy: JSON.stringify(objectHierarchy),
    properties: JSON.stringify(properties),
    assemblyData: JSON.stringify(assemblyData),
  });

  return mergedData;
}

export { 
    getInputs, 
    integrateInputs
};