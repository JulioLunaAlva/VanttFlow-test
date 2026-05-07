const fs = require('fs');
let content = fs.readFileSync('src/i18n.js', 'utf8');

if (!content.includes('"analytics": {')) {
    content = content.replace('translation: {', 'translation: {\n"analytics": {"monthly_spend": "Gasto Mensual"},\n');
    fs.writeFileSync('src/i18n.js', content);
    console.log('Injected analytics');
} else {
    console.log('Analytics already exists');
}
