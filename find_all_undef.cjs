const { ESLint } = require("eslint");

(async function main() {
  // Configuro ESLint para asegurarse que jsx-no-undef sea un error.
  const eslint = new ESLint({
    overrideConfig: {
      rules: {
        "react/jsx-no-undef": "error",
        "no-undef": "error"
      }
    }
  });

  try {
    const results = await eslint.lintFiles(["src/**/*.jsx", "src/**/*.js"]);

    // Formatear resultados
    const formatter = await eslint.loadFormatter("stylish");
    const resultText = formatter.format(results);

    // Filtrar solo los errores de no-undef y react/jsx-no-undef
    let undefErrorsFound = false;
    results.forEach(result => {
        const undefMessages = result.messages.filter(msg => msg.ruleId === 'no-undef' || msg.ruleId === 'react/jsx-no-undef');
        if (undefMessages.length > 0) {
            undefErrorsFound = true;
            console.log(`\nArchivo: ${result.filePath}`);
            undefMessages.forEach(msg => {
                console.log(`  Línea ${msg.line}:${msg.column} - ${msg.message} (${msg.ruleId})`);
            });
        }
    });

    if (!undefErrorsFound) {
        console.log("No se encontraron errores de 'no-undef' ni 'react/jsx-no-undef'. ¡Todo limpio!");
    } else {
        console.log("\nRevisa los errores listados arriba.");
    }
  } catch (error) {
    console.error("Error al ejecutar ESLint:", error);
  }
})().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});
