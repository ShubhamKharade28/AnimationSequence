import path from 'path';

import { getInputs, integrateInputs } from './input_utils.js';
import { saveJsonToFile } from './output_utils.js';

import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { JsonOutputParser } from '@langchain/core/output_parsers';

import { model } from './langchain_setup.js';

async function generateAnimationSequence() {
    const { objectHierarchy, properties, assemblyData } = getInputs();
    const integratedInputs = await integrateInputs(objectHierarchy, properties, assemblyData);

    // optional: save the integrated inputs to a file
    saveJsonToFile(integratedInputs, path.join('outputs', 'complete_data.json'));

    // Step 1: Generate prompt for the animation
    const animationPrompt = ChatPromptTemplate.fromTemplate(
        `
        You are an animation sequencing expert.

        Given an integrated mechanical assembly JSON object with:
        - "fragments": representing components (each has fragmentId, name, metadata)
        - "constraints" and "joints": relationships between fragments

        Generate an animation sequence to disassemble the assembly safely and clearly.

        Output format:
        [
            {{
                "fragmentName": <string>
                "fragmentId": <number>,
                "action": "translate" | "rotate" | "scale",
                "params": {{
                    // For "translate": "x": <number>, "y": <number>, "z": <number>
                    // For "rotate": "axis": "x"|"y"|"z", "angle": <degrees>
                    // For "scale": "factor": <number>
                }}
            }},
            ...
        ]

        Guidelines:
        - Begin with outermost fragments first (no dependencies).
        - Move parts along clear, non-overlapping paths (e.g., axis-aligned).
        - Rotate only if meaningful for visual clarity.
        - Use small scale adjustments only if needed (rare).
        - Keep total steps >= 15 and <= 30 if possible
        - At last their all parts should be at default place (should look like complete assembly)

        Here is the data:
        {integratedData}
        `.trim());

    // Step 2: Prepare runnable chain
    const animationChain = RunnableSequence.from([
        animationPrompt,
        model,
        new JsonOutputParser(),
    ]);

    // Step 3: Run the chain
    const animationSequence = await animationChain.invoke({
        integratedData: JSON.stringify(integratedInputs)
    });

    // Step 4: Save the animation sequence
    saveJsonToFile(animationSequence, path.join('outputs', 'animation_sequence.json'));
}

export { generateAnimationSequence };
