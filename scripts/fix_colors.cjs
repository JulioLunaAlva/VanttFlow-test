const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        const dirFile = path.join(dir, file);
        try {
            filelist = walkSync(dirFile, filelist);
        }
        catch (err) {
            if (err.code === 'ENOTDIR' || err.code === 'EBADF') filelist.push(dirFile);
            else throw err;
        }
    });
    return filelist;
};

const srcDir = path.join(__dirname, '..', 'src');
const files = walkSync(srcDir).filter(f => f.endsWith('.jsx') || f.endsWith('.tsx') || f.endsWith('.js'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // text-white replacements
    content = content.replace(/text-white(\/(\d+))?/g, (match, slash, num) => {
        if (num) {
            return `text-foreground/${num}`;
        }
        return 'text-foreground';
    });

    // bg-white replacements
    content = content.replace(/bg-white(\/(\d+))?/g, (match, slash, num) => {
        if (num) {
            return `bg-foreground/${num}`;
        }
        // bg-white with no slash should probably stay bg-card or bg-background
        return 'bg-card';
    });

    // border-white replacements
    content = content.replace(/border-white(\/(\d+))?/g, (match, slash, num) => {
        if (num) {
            // Mapping /5, /10, /20 etc. to border-border/10, etc.
            // Actually border-border is usually enough, but let's keep opacity
            if (parseInt(num) <= 10) return 'border-border/30';
            return 'border-border/50';
        }
        return 'border-border';
    });

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
});
