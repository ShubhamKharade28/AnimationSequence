
import { runInventorExporter, runModelDerivativeApi, moveModelDerivativeResults } from './execution.js';
import { generateAnimationSequence } from './animation/generate_animation.js';

async function runAnimationPipeline() {
    const { logError } = await import('./log_error.js');
    try {
        await runInventorExporter();
        await runModelDerivativeApi();
        await moveModelDerivativeResults();
        await generateAnimationSequence();
    }
    catch (error) {
        logError(`Pipeline execution failed: ${error.message}`);
    }
    finally {
        console.log("Pipeline execution completed.");
    }
}

runAnimationPipeline();