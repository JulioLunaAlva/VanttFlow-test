const fs = require('fs');
let c = fs.readFileSync('src/i18n.js', 'utf8');

// Fix PT nav - add calendar and quick_actions
const PT_NAV_OLD = `menu: "Menu"
                    }
                },
                dashboard: {
                    title: "Painel de Controle"`;

const PT_NAV_NEW = `menu: "Menu",
                        calendar: "Calendário"
                    },
                    quick_actions: {
                        title: "Ações Rápidas",
                        new_transaction: "Nova Transação",
                        new_account: "Nova Conta",
                        new_goal: "Nova Meta",
                        new_category: "Nova Categoria"
                    }
                },
                dashboard: {
                    title: "Painel de Controle"`;

if (c.includes(PT_NAV_OLD)) {
    c = c.replace(PT_NAV_OLD, PT_NAV_NEW);
    console.log('✅ PT nav fixed');
} else {
    // Try normalized
    const idx = c.indexOf('menu: "Menu"\r\n                    }\r\n                },\r\n                dashboard: {\r\n                    title: "Painel de Controle"');
    if (idx > -1) {
        c = c.replace('menu: "Menu"\r\n                    }\r\n                },\r\n                dashboard: {\r\n                    title: "Painel de Controle"',
            'menu: "Menu",\r\n                        calendar: "Calendário"\r\n                    },\r\n                    quick_actions: {\r\n                        title: "Ações Rápidas",\r\n                        new_transaction: "Nova Transação",\r\n                        new_account: "Nova Conta",\r\n                        new_goal: "Nova Meta",\r\n                        new_category: "Nova Categoria"\r\n                    }\r\n                },\r\n                dashboard: {\r\n                    title: "Painel de Controle"');
        console.log('✅ PT nav fixed (CRLF)');
    } else {
        console.log('⚠️  PT nav NOT found - checking context...');
        const idx2 = c.indexOf('menu: "Menu"');
        console.log('menu: "Menu" found at index:', idx2);
        // Show surrounding text
        if (idx2 > -1) {
            console.log('Context:', JSON.stringify(c.substring(idx2 - 20, idx2 + 100)));
        }
    }
}

// Fix FR nav - add calendar and quick_actions  
const FR_NAV_SEARCH = 'menu: "Menu"\r\n                    }\r\n                },\r\n                dashboard: {\r\n                    title: "Tableau de bord"';
if (c.includes(FR_NAV_SEARCH)) {
    c = c.replace(FR_NAV_SEARCH,
        'menu: "Menu",\r\n                        calendar: "Calendrier"\r\n                    },\r\n                    quick_actions: {\r\n                        title: "Actions Rapides",\r\n                        new_transaction: "Nouvelle Transaction",\r\n                        new_account: "Nouveau Compte",\r\n                        new_goal: "Nouvel Objectif",\r\n                        new_category: "Nouvelle Catégorie"\r\n                    }\r\n                },\r\n                dashboard: {\r\n                    title: "Tableau de bord"');
    console.log('✅ FR nav fixed');
} else {
    console.log('⚠️  FR nav NOT found');
    // Show all occurrences of 'Tableau de bord'
    const idx = c.indexOf('"Tableau de bord"');
    if (idx > -1) {
        console.log('FR dashboard context:', JSON.stringify(c.substring(idx - 100, idx + 50)));
    }
}

fs.writeFileSync('src/i18n.js', c, 'utf8');
console.log('Done! File size:', c.length);
