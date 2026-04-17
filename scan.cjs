const fs = require('fs');
const path = require('path');

function getFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      getFiles(path.join(dir, file), filesList);
    } else {
      if (file.endsWith('.jsx')) {
        filesList.push(path.join(dir, file));
      }
    }
  }
  return filesList;
}

const allFiles = getFiles('./src');
const undefinedElements = new Map();

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  
  // Find all used components
  const componentRegex = /<([A-Z][A-Za-z0-9_]*)/g;
  const usedComponents = new Set();
  let match;
  while ((match = componentRegex.exec(content)) !== null) {
    usedComponents.add(match[1]);
  }

  // Very simple way to check if component is defined:
  // It should be imported, OR declared as a const, function, or class within the file.
  const missing = [];
  for (const comp of usedComponents) {
    // Check if imported
    const importRegex = new RegExp(`import\\s+[^;]*\\b${comp}\\b`, 'g');
    // Check if let/const/var/function/class
    const declRegex = new RegExp(`(?:const|let|var|function|class)\\s+${comp}\\b`, 'g');
    
    // Specifically for React context, props, etc: some components may be defined internally
    if (!importRegex.test(content) && !declRegex.test(content)) {
        // Exclude some built-ins or fragments
        if (comp !== 'Fragment' && comp !== 'React') {
            missing.push(comp);
        }
    }
  }

  if (missing.length > 0) {
    undefinedElements.set(file, missing);
  }
}

if (undefinedElements.size === 0) {
  console.log("No potential missing UI components found!");
} else {
  console.log("Potential missing UI components:");
  for (const [file, missing] of undefinedElements.entries()) {
    console.log(`\nArchivo: ${file}`);
    console.log(`  Faltan: ${missing.join(', ')}`);
  }
}
