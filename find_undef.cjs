const { ESLint } = require("eslint");

(async function main() {
    try {
        const eslint = new ESLint({});
        const results = await eslint.lintFiles(["src/**/*.jsx"]);
        
        let foundErrors = false;
        for (const result of results) {
            for (const message of result.messages) {
                if (message.ruleId === "no-undef") {
                    console.log(`no-undef error in ${result.filePath} line ${message.line}: ${message.message}`);
                    foundErrors = true;
                }
            }
        }
        
        if (!foundErrors) {
            console.log("No undefined variable errors found!");
        }
    } catch (error) {
        process.exitCode = 1;
        console.error("Script error:", error);
    }
})();
