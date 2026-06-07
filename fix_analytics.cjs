const fs = require('fs');
let c = fs.readFileSync('src/i18n.js', 'utf8');
const originalSize = c.length;
let changeCount = 0;

function replace(search, replacement, label) {
    if (c.includes(search)) {
        c = c.replace(search, replacement);
        changeCount++;
        console.log(`✅ ${label}`);
    } else {
        console.log(`⚠️  NOT FOUND: ${label}`);
    }
}

// ===================================================
// FIX: Add monthly_spend + other missing analytics keys to ES
// ===================================================
replace(
    `                others: "Otros"\r\n            },\r\n            reports: {`,
    `                others: "Otros",\r\n                monthly_spend: "Gasto Mensual"\r\n            },\r\n            reports: {`,
    'ES analytics - added monthly_spend'
);

// ===================================================
// FIX: Add monthly_spend to EN
// ===================================================
replace(
    `                    others: "Others"\r\n                },\r\n                reports: {`,
    `                    others: "Others",\r\n                    monthly_spend: "Monthly Spend"\r\n                },\r\n                reports: {`,
    'EN analytics - added monthly_spend'
);

// ===================================================
// FIX: Add monthly_spend to PT
// ===================================================
replace(
    `                    others: "Outros"\r\n                },\r\n                reports: {`,
    `                    others: "Outros",\r\n                    monthly_spend: "Gasto Mensal"\r\n                },\r\n                reports: {`,
    'PT analytics - added monthly_spend'
);

// ===================================================
// FIX: Add monthly_spend to FR
// ===================================================
replace(
    `                    others: "Autres"\r\n                },\r\n                reports: {`,
    `                    others: "Autres",\r\n                    monthly_spend: "Dépense Mensuelle"\r\n                },\r\n                reports: {`,
    'FR analytics - added monthly_spend'
);

// Also check if analytics has cash_flow_title, savings_summary etc. in EN/PT/FR
// EN analytics
replace(
    `                    patrimony_evolution: "Patrimony Evolution",`,
    `                    patrimony_evolution: "Patrimony Evolution",\r\n                    cash_flow_title: "Historical Cash Flow",\r\n                    savings_summary: "Savings Summary",\r\n                    net_savings: "Net Savings (This Month)",\r\n                    of_income_spent: "of your income has been spent",\r\n                    no_income_data: "No income data for this month",`,
    'EN analytics - added cash_flow and savings keys'
);

// PT analytics  
replace(
    `                    patrimony_evolution: "Evolução do Patrimônio",`,
    `                    patrimony_evolution: "Evolução do Patrimônio",\r\n                    cash_flow_title: "Fluxo de Caixa Histórico",\r\n                    savings_summary: "Resumo de Poupança",\r\n                    net_savings: "Poupança Líquida (Este Mês)",\r\n                    of_income_spent: "da sua renda foi gasta",\r\n                    no_income_data: "Sem dados de renda para este mês",`,
    'PT analytics - added cash_flow and savings keys'
);

// FR analytics
replace(
    `                    patrimony_evolution: "Évolution du Patrimoine",`,
    `                    patrimony_evolution: "Évolution du Patrimoine",\r\n                    cash_flow_title: "Flux de Trésorerie Historique",\r\n                    savings_summary: "Résumé d'Épargne",\r\n                    net_savings: "Épargne Nette (Ce Mois)",\r\n                    of_income_spent: "de vos revenus ont été dépensés",\r\n                    no_income_data: "Aucune donnée de revenus pour ce mois",`,
    'FR analytics - added cash_flow and savings keys'
);

fs.writeFileSync('src/i18n.js', c, 'utf8');
console.log(`\n✅ Total changes: ${changeCount}`);
console.log(`📁 File size: ${originalSize} → ${c.length} bytes (+${c.length - originalSize})`);
