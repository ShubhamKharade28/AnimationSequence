const { runInventorExporter, runModelDerivativeApi, moveModelDerivativeResults } = require('./execution.js');
const { generateAnimationSequence } = require('./generate_animation.js');

async function runAnimationPipeline() {
    const { logError } = require('./log_error');
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