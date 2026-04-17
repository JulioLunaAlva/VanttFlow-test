import fs from 'fs';

const pages = [
    'src/pages/AnalyticsPage.jsx',
    'src/pages/SettingsPage.jsx', 
    'src/pages/GoalsPage.jsx',
    'src/pages/BudgetPage.jsx',
    'src/pages/ScheduledPage.jsx',
    'src/pages/CategoriesPage.jsx',
    'src/pages/SubscriptionsPage.jsx',
    'src/pages/MarketPage.jsx',
    'src/pages/AccountsPage.jsx',
];

let totalFixed = 0;

pages.forEach(filePath => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const before = content;
        
        // Replace oversized page header titles (main section headers)
        content = content.replace(
            /text-5xl font-black tracking-tighter text-white drop-shadow-2xl/g,
            'text-3xl md:text-4xl font-black tracking-tighter text-white drop-shadow-2xl'
        );
        content = content.replace(
            /text-5xl font-black tracking-tighter text-white/g,
            'text-3xl md:text-4xl font-black tracking-tighter text-white'
        );

        if (before !== content) {
            fs.writeFileSync(filePath, content, 'utf8');
            const count = (before.match(/text-5xl/g) || []).length;
            console.log(`Fixed ${count} occurrences in: ${filePath}`);
            totalFixed += count;
        } else {
            console.log(`No changes needed in: ${filePath}`);
        }
    } catch(e) {
        console.error(`Error processing ${filePath}: ${e.message}`);
    }
});

console.log(`\nTotal replacements: ${totalFixed}`);
