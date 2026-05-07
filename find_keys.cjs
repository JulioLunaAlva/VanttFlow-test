const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
let keys = new Set();

function walkSync(dir) {
    let files = [];
    for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            files = files.concat(walkSync(fullPath));
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            files.push(fullPath);
        }
    }
    return files;
}

const files = walkSync(srcDir);
files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    const regex = /t\(['"]([a-zA-Z0-9_\.]+)['"]\)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        keys.add(match[1]);
    }
});

const sortedKeys = Array.from(keys).sort();
fs.writeFileSync('used_keys.txt', sortedKeys.join('\n'));
