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
// 1. FIX ES reports - merge missing keys from dead code 
// ===================================================
replace(
    `            reports: {\r\n                title: "Reportes Avanzados",\r\n                comparative_title: "Comparativa Semestral (Ingresos vs Gastos)",\r\n                income_label: "Ingresos",\r\n                expense_label: "Gastos"\r\n            },`,
    `            reports: {\r\n                title: "Reportes Avanzados",\r\n                comparative_title: "Comparativa Semestral (Ingresos vs Gastos)",\r\n                income_label: "Ingresos",\r\n                expense_label: "Gastos",\r\n                semiannual_comparison: "Comparativa Semestral",\r\n                expenses_by_category: "Gastos por Categoría",\r\n                financial_health_metrics: "Métricas de Salud Financiera",\r\n                recommended_target: "Objetivo Recomendado",\r\n                average_income: "Ingreso Promedio",\r\n                average_expense: "Gasto Promedio",\r\n                savings_rate: "Tasa de Ahorro"\r\n            },`,
    'ES reports - added 7 missing keys'
);

// ===================================================
// 2. FIX ES accounts - add missing "investment" and "credit"/"debit" short labels
// ===================================================
replace(
    `                installments: "Parcialidades",\r\n                fortnightly: "Quincenal",\r\n                monthly: "Mensual"\r\n            },\r\n            notes:`,
    `                installments: "Parcialidades",\r\n                fortnightly: "Quincenal",\r\n                monthly: "Mensual",\r\n                investment: "Inversión",\r\n                credit: "Crédito",\r\n                debit: "Débito"\r\n            },\r\n            notes:`,
    'ES accounts - added investment, credit, debit'
);

// ===================================================
// 3. FIX ES transactions - add missing keys
// ===================================================
replace(
    `                fortnightly: "Quincenal"\r\n            },\r\n            summary:`,
    `                fortnightly: "Quincenal",\r\n                amount: "Monto",\r\n                date: "Fecha",\r\n                no_movements: "No hay movimientos registrados"\r\n            },\r\n            summary:`,
    'ES transactions - added amount, date, no_movements'
);

// ===================================================
// 4. FIX EN common - add missing keys
// ===================================================
replace(
    `                    cancel: "Cancel",\r\n                    export_csv: "Export CSV",`,
    `                    cancel: "Cancel",\r\n                    delete: "Delete",\r\n                    great_job: "Great job!",\r\n                    more: "More",\r\n                    others: "Others",\r\n                    continue: "Continue",\r\n                    start: "Start",\r\n                    export_csv: "Export CSV",`,
    'EN common - added delete, great_job, more, others, continue, start'
);

replace(
    `                        calendar: "Calendar"\r\n                    }\r\n                },\r\n                dashboard: {\r\n                    title: "Dashboard",`,
    `                        calendar: "Calendar"\r\n                    },\r\n                    quick_actions: {\r\n                        title: "Quick Actions",\r\n                        new_transaction: "New Transaction",\r\n                        new_account: "New Account",\r\n                        new_goal: "New Goal",\r\n                        new_category: "New Category"\r\n                    }\r\n                },\r\n                dashboard: {\r\n                    title: "Dashboard",`,
    'EN common - added quick_actions'
);

// ===================================================
// 5. FIX EN dashboard - add missing keys
// ===================================================
replace(
    `                    ai_advice: "VanttAI Advisor",\r\n                    goal_target: "Target",`,
    `                    ai_advice: "VanttAI Advisor",\r\n                    accounts_breakdown: "Accounts Breakdown",\r\n                    more_goals_count: "more goals",\r\n                    no_accounts: "No Accounts",\r\n                    saved_amount: "Saved",\r\n                    advice: {\r\n                        ask_advice: "How am I doing?",\r\n                        how_am_i: "Health status",\r\n                        check_budget: "View Budgets",\r\n                        view_analytics: "View Charts",\r\n                        danger_forecast_title: "FLOW ALERT",\r\n                        danger_forecast_desc: "Your projected expenses exceed your income this month. Be careful!",\r\n                        budget_limit_title: "LIMIT NEAR",\r\n                        budget_limit_desc: "You've used {{percentage}}% of your {{category}} budget.",\r\n                        low_savings_title: "SAVING CAPACITY",\r\n                        low_savings_desc: "Your expenses consume almost all your income. Try to reduce variables.",\r\n                        great_score_title: "EXCELLENT SCORE!",\r\n                        great_score_desc: "Your financial discipline is impeccable. Keep it up!",\r\n                        trend_increase_title: "SPENDING TREND",\r\n                        trend_increase_desc: "Your {{category}} spending rose {{percentage}}% this month.",\r\n                        default_title: "ALL IN ORDER",\r\n                        default_desc: "Keep logging your expenses to receive personalized tips."\r\n                    },\r\n                    goal_target: "Target",`,
    'EN dashboard - added ai_advice block, accounts_breakdown, advice.*'
);

// 5b. EN dashboard balance_chart
replace(
    `                    balance: "Net Balance",\r\n                    balance_chart: {\r\n                        title: "Net Balance",\r\n                        subtitle: "Period balance",\r\n                        difference: "Difference",\r\n                        no_data: "No balance data",\r\n                        no_data_desc: "Register your first transactions to see your comparison here"\r\n                    },`,
    `                    balance: "Net Balance",\r\n                    accounts_breakdown: "Accounts Breakdown",\r\n                    balance_chart: {\r\n                        title: "Net Balance",\r\n                        subtitle: "Period balance",\r\n                        difference: "Difference",\r\n                        no_data: "No balance data",\r\n                        no_data_desc: "Register your first transactions to see your comparison here"\r\n                    },`,
    'EN dashboard - balance_chart (also add accounts_breakdown near balance)'
);

// ===================================================
// 6. FIX EN accounts - add missing keys
// ===================================================
replace(
    `                    installments: "Installments",\r\n                    fortnightly: "Biweekly",\r\n                    monthly: "Monthly"\r\n                },\r\n                notes:`,
    `                    installments: "Installments",\r\n                    fortnightly: "Biweekly",\r\n                    monthly: "Monthly",\r\n                    investment: "Investment",\r\n                    credit: "Credit",\r\n                    debit: "Debit",\r\n                    total_assets: "Assets"\r\n                },\r\n                notes:`,
    'EN accounts - added investment, credit, debit, total_assets'
);

// ===================================================
// 7. FIX EN budget - add subtitle
// ===================================================
replace(
    `                budget: {\r\n                    title: "Budgets",\r\n                    total_budget: "Total Budget",`,
    `                budget: {\r\n                    title: "Budgets",\r\n                    subtitle: "Plan and control your monthly expenses",\r\n                    total_budget: "Total Budget",`,
    'EN budget - added subtitle'
);

// ===================================================
// 8. FIX EN transactions - add missing keys
// ===================================================
replace(
    `                    fortnightly: "Fortnightly"\r\n            },\r\n                summary:`,
    `                    fortnightly: "Fortnightly",\r\n                    amount: "Amount",\r\n                    date: "Date",\r\n                    no_movements: "No transactions recorded",\r\n                    manage_desc: "Control your income and expenses in detail."\r\n            },\r\n                summary:`,
    'EN transactions - added amount, date, no_movements, manage_desc'
);

// ===================================================
// 9. FIX EN market_tips
// ===================================================
replace(
    `                    market_pulses: "Market Pulses",\r\n                    smart_market: "Smart Market",\r\n                    market_tip: "The currency is strong today. It's a good time to settle debts in foreign currency.",`,
    `                    market_pulses: "Market Pulses",\r\n                    smart_market: "VanttAI Market Insight",\r\n                    market_tip: "The currency is strong today. It's a good time to settle debts in foreign currency.",\r\n                    market_tips: {\r\n                        usd_stable: "The peso is strong today. Good time to settle dollar-denominated debts.",\r\n                        usd_high: "The dollar is rising. Avoid unnecessary expenses in foreign currencies.",\r\n                        crypto_up: "Crypto in the green. Consider taking profits if you hit your targets.",\r\n                        crypto_down: "High crypto volatility. Stay calm and stick to your long-term plan.",\r\n                        low_volatility: "Stable market. Great time to review your recurring investments."\r\n                    },`,
    'EN dashboard - added market_tips'
);

// ===================================================
// 10. FIX PT common - add missing keys
// ===================================================
replace(
    `                    cancel: "Cancelar",\r\n                    export_csv: "Exportar CSV",\r\n                    main_menu: "Principal",\r\n                    tools: "Ferramentas",\r\n                    system: "Sistema",\r\n                    nav: {\r\n                        home: "Início",`,
    `                    cancel: "Cancelar",\r\n                    delete: "Excluir",\r\n                    great_job: "Bom trabalho!",\r\n                    more: "Mais",\r\n                    others: "Outros",\r\n                    continue: "Continuar",\r\n                    start: "Começar",\r\n                    accounts: "Contas",\r\n                    calendar: "Calendário",\r\n                    today: "Hoje",\r\n                    assets: "Ativos",\r\n                    liabilities: "Passivos",\r\n                    calendar_view: "Visualização de Calendário",\r\n                    export_csv: "Exportar CSV",\r\n                    main_menu: "Principal",\r\n                    tools: "Ferramentas",\r\n                    system: "Sistema",\r\n                    nav: {\r\n                        home: "Início",`,
    'PT common - added missing keys'
);

replace(
    `                        menu: "Menu"\r\n                    }\r\n                },\r\n                dashboard: {\r\n                    title: "Painel de Controle",`,
    `                        menu: "Menu",\r\n                        calendar: "Calendário"\r\n                    },\r\n                    quick_actions: {\r\n                        title: "Ações Rápidas",\r\n                        new_transaction: "Nova Transação",\r\n                        new_account: "Nova Conta",\r\n                        new_goal: "Nova Meta",\r\n                        new_category: "Nova Categoria"\r\n                    }\r\n                },\r\n                dashboard: {\r\n                    title: "Painel de Controle",`,
    'PT common - nav.calendar and quick_actions'
);

// 10b. PT dashboard - missing keys
replace(
    `                    view_all_goals: "Ver todas",\r\n                    goal_target: "Objetivo",`,
    `                    view_all_goals: "Ver todas",\r\n                    ai_advice: "VanttAI Advisor",\r\n                    accounts_breakdown: "Resumo de Contas",\r\n                    more_goals_count: "metas a mais",\r\n                    no_accounts: "Sem Contas",\r\n                    saved_amount: "Economizado",\r\n                    advice: {\r\n                        ask_advice: "Como estou?",\r\n                        how_am_i: "Status de saúde",\r\n                        check_budget: "Ver Orçamentos",\r\n                        view_analytics: "Ver Gráficos",\r\n                        danger_forecast_title: "ALERTA DE FLUXO",\r\n                        danger_forecast_desc: "Suas despesas projetadas excedem sua renda este mês. Cuidado!",\r\n                        budget_limit_title: "LIMITE PRÓXIMO",\r\n                        budget_limit_desc: "Você usou {{percentage}}% do seu orçamento em {{category}}.",\r\n                        low_savings_title: "CAPACIDADE DE POUPANÇA",\r\n                        low_savings_desc: "Suas despesas consomem quase toda sua renda. Tente reduzir variáveis.",\r\n                        great_score_title: "EXCELENTE SCORE!",\r\n                        great_score_desc: "Sua disciplina financeira é impecável. Continue assim!",\r\n                        trend_increase_title: "TENDÊNCIA DE GASTO",\r\n                        trend_increase_desc: "Seu gasto em {{category}} subiu {{percentage}}% este mês.",\r\n                        default_title: "TUDO EM ORDEM",\r\n                        default_desc: "Continue registrando suas despesas para receber dicas personalizadas."\r\n                    },\r\n                    goal_target: "Objetivo",`,
    'PT dashboard - added ai_advice, advice.*, accounts_breakdown'
);

// PT balance_chart missing
replace(
    `                    balance: "Balanço Geral",\r\n                    forecast: "Previsão Fim do Mês",`,
    `                    balance: "Balanço Geral",\r\n                    balance_chart: {\r\n                        title: "Balanço Geral",\r\n                        subtitle: "Saldo do período",\r\n                        difference: "Diferença",\r\n                        no_data: "Sem dados de saldo",\r\n                        no_data_desc: "Registre suas primeiras transações para ver sua comparação aqui"\r\n                    },\r\n                    forecast: "Previsão Fim do Mês",`,
    'PT dashboard - added balance_chart'
);

// PT market_tips
replace(
    `                    market_pulses: "Pulsos do Mercado",\r\n                    smart_market: "Mercado Inteligente",\r\n                    market_tip: "A moeda está forte hoje. É um bom momento para quitar dívidas em dólar.",`,
    `                    market_pulses: "Pulsos do Mercado",\r\n                    smart_market: "VanttAI Market Insight",\r\n                    market_tip: "A moeda está forte hoje. É um bom momento para quitar dívidas em dólar.",\r\n                    market_tips: {\r\n                        usd_stable: "O peso está forte hoje. Bom momento para quitar dívidas em dólar.",\r\n                        usd_high: "O dólar está subindo. Evite gastos desnecessários em moedas estrangeiras.",\r\n                        crypto_up: "Criptos no verde. Considere realizar lucros se atingir suas metas.",\r\n                        crypto_down: "Alta volatilidade em criptomoedas. Mantenha a calma e seu plano de longo prazo.",\r\n                        low_volatility: "Mercado estável. Ótimo momento para revisar seus investimentos recorrentes."\r\n                    },`,
    'PT dashboard - added market_tips'
);

// PT forecast buffer_safety
replace(
    `                        expected_income: "Receitas esperadas:"\r\n                    }\r\n                },\r\n                transactions: {\r\n                    new_title: "Nova Transação",`,
    `                        expected_income: "Receitas esperadas:",\r\n                        buffer_safety: "Margem de segurança"\r\n                    }\r\n                },\r\n                transactions: {\r\n                    new_title: "Nova Transação",`,
    'PT dashboard - added forecast buffer_safety'
);

// PT transactions missing keys
replace(
    `                    fortnightly: "Quinzenal"\r\n                },\r\n                summary: {\r\n                    total_balance: "Saldo Total",`,
    `                    fortnightly: "Quinzenal",\r\n                    amount: "Valor",\r\n                    date: "Data",\r\n                    no_movements: "Sem transações registradas",\r\n                    manage_desc: "Controle suas receitas e despesas de forma detalhada."\r\n                },\r\n                summary: {\r\n                    total_balance: "Saldo Total",`,
    'PT transactions - added amount, date, no_movements, manage_desc'
);

// PT accounts - add missing keys
replace(
    `                    no_debit_accounts_desc: "Adicione seu dinheiro inicial ou contas de salário."\r\n                },\r\n                categories: {\r\n                    title: "Categorias",\r\n                    subtitle: "Gerencie`,
    `                    no_debit_accounts_desc: "Adicione seu dinheiro inicial ou contas de salário.",\r\n                    total_assets: "Ativos",\r\n                    total_debts: "Passivos",\r\n                    proportion: "{{percent}}% do total",\r\n                    account_name: "Nome da Conta",\r\n                    account_type: "Tipo de Conta",\r\n                    add_new: "Adicionar Conta",\r\n                    available_balance: "Saldo Disponível",\r\n                    cash_option: "Dinheiro",\r\n                    confirm_delete: "Tem certeza que deseja excluir esta conta?",\r\n                    credit_option: "Cartão de Crédito",\r\n                    current_balance: "Saldo Atual",\r\n                    debit_option: "Conta de Débito",\r\n                    delete_desc: "Esta ação não pode ser desfeita.",\r\n                    distinctive_color: "Cor Distintiva",\r\n                    edit_desc: "Modifique os detalhes da sua conta",\r\n                    initial_debt: "Dívida Inicial",\r\n                    investment_option: "Investimento",\r\n                    investment: "Investimento",\r\n                    credit: "Crédito",\r\n                    debit: "Débito",\r\n                    manage: "Gerenciar Contas",\r\n                    manage_subtitle: "Gerencie suas contas, cartões e dinheiro",\r\n                    payment_day: "Dia de Pagamento",\r\n                    installments: "Parcelas",\r\n                    fortnightly: "Quinzenal",\r\n                    monthly: "Mensal"\r\n                },\r\n                categories: {\r\n                    title: "Categorias",\r\n                    subtitle: "Gerencie`,
    'PT accounts - added all missing keys'
);

// PT budget subtitle
replace(
    `                budget: {\r\n                    title: "Orçamentos",\r\n                    total_budget: "Orçamento Total",`,
    `                budget: {\r\n                    title: "Orçamentos",\r\n                    subtitle: "Planeje e controle seus gastos mensais",\r\n                    total_budget: "Orçamento Total",`,
    'PT budget - added subtitle'
);

// ===================================================
// 11. FIX FR common - add missing keys
// ===================================================
replace(
    `                    cancel: "Annuler",\r\n                    export_csv: "Exporter CSV",\r\n                    main_menu: "Principal",\r\n                    tools: "Outils",\r\n                    system: "Système",\r\n                    nav: {\r\n                        home: "Accueil",`,
    `                    cancel: "Annuler",\r\n                    delete: "Supprimer",\r\n                    great_job: "Bon travail !",\r\n                    more: "Plus",\r\n                    others: "Autres",\r\n                    continue: "Continuer",\r\n                    start: "Commencer",\r\n                    accounts: "Comptes",\r\n                    calendar: "Calendrier",\r\n                    today: "Aujourd'hui",\r\n                    assets: "Actifs",\r\n                    liabilities: "Passifs",\r\n                    calendar_view: "Vue Calendrier",\r\n                    export_csv: "Exporter CSV",\r\n                    main_menu: "Principal",\r\n                    tools: "Outils",\r\n                    system: "Système",\r\n                    nav: {\r\n                        home: "Accueil",`,
    'FR common - added missing keys'
);

replace(
    `                        menu: "Menu"\r\n                    }\r\n                },\r\n                dashboard: {\r\n                    title: "Tableau de bord",`,
    `                        menu: "Menu",\r\n                        calendar: "Calendrier"\r\n                    },\r\n                    quick_actions: {\r\n                        title: "Actions Rapides",\r\n                        new_transaction: "Nouvelle Transaction",\r\n                        new_account: "Nouveau Compte",\r\n                        new_goal: "Nouvel Objectif",\r\n                        new_category: "Nouvelle Catégorie"\r\n                    }\r\n                },\r\n                dashboard: {\r\n                    title: "Tableau de bord",`,
    'FR common - nav.calendar and quick_actions'
);

// FR dashboard - missing keys
replace(
    `                    view_all_goals: "Voir tout",\r\n                    goal_target: "Objectif",`,
    `                    view_all_goals: "Voir tout",\r\n                    ai_advice: "VanttAI Advisor",\r\n                    accounts_breakdown: "Résumé des Comptes",\r\n                    more_goals_count: "objectifs de plus",\r\n                    no_accounts: "Aucun Compte",\r\n                    saved_amount: "Économisé",\r\n                    advice: {\r\n                        ask_advice: "Comment je vais ?",\r\n                        how_am_i: "État de santé",\r\n                        check_budget: "Voir les Budgets",\r\n                        view_analytics: "Voir les Graphiques",\r\n                        danger_forecast_title: "ALERTE DE FLUX",\r\n                        danger_forecast_desc: "Vos dépenses prévues dépassent vos revenus ce mois. Attention !",\r\n                        budget_limit_title: "LIMITE PROCHE",\r\n                        budget_limit_desc: "Vous avez utilisé {{percentage}}% de votre budget {{category}}.",\r\n                        low_savings_title: "CAPACITÉ D'ÉPARGNE",\r\n                        low_savings_desc: "Vos dépenses consomment presque tous vos revenus. Essayez de réduire les variables.",\r\n                        great_score_title: "EXCELLENT SCORE !",\r\n                        great_score_desc: "Votre discipline financière est impeccable. Continuez ainsi !",\r\n                        trend_increase_title: "TENDANCE DE DÉPENSES",\r\n                        trend_increase_desc: "Vos dépenses {{category}} ont augmenté de {{percentage}}% ce mois.",\r\n                        default_title: "TOUT EN ORDRE",\r\n                        default_desc: "Continuez à enregistrer vos dépenses pour recevoir des conseils personnalisés."\r\n                    },\r\n                    goal_target: "Objectif",`,
    'FR dashboard - added ai_advice, advice.*, accounts_breakdown'
);

// FR balance_chart
replace(
    `                    balance: "Bilan global",\r\n                    forecast: "Prévisions fin de mois",`,
    `                    balance: "Bilan global",\r\n                    balance_chart: {\r\n                        title: "Bilan global",\r\n                        subtitle: "Solde de la période",\r\n                        difference: "Différence",\r\n                        no_data: "Pas de données de solde",\r\n                        no_data_desc: "Enregistrez vos premières transactions pour voir votre comparaison ici"\r\n                    },\r\n                    forecast: "Prévisions fin de mois",`,
    'FR dashboard - added balance_chart'
);

// FR market_tips
replace(
    `                    market_pulses: "Pulsions du marché",\r\n                    smart_market: "Marché intelligent",\r\n                    market_tip: "La monnaie est forte aujourd'hui. C'est le bon moment pour régler vos dettes en devises.",`,
    `                    market_pulses: "Pulsions du marché",\r\n                    smart_market: "VanttAI Market Insight",\r\n                    market_tip: "La monnaie est forte aujourd'hui. C'est le bon moment pour régler vos dettes en devises.",\r\n                    market_tips: {\r\n                        usd_stable: "Le peso est fort aujourd'hui. Bon moment pour régler des dettes en dollars.",\r\n                        usd_high: "Le dollar monte. Évitez les dépenses inutiles en devises étrangères.",\r\n                        crypto_up: "Cryptos au vert. Envisagez de prendre des bénéfices si vous atteignez vos objectifs.",\r\n                        crypto_down: "Haute volatilité des cryptos. Restez calme et tenez votre plan à long terme.",\r\n                        low_volatility: "Marché stable. Bon moment pour revoir vos investissements récurrents."\r\n                    },`,
    'FR dashboard - added market_tips'
);

// FR forecast buffer_safety
replace(
    `                        expected_income: "Revenus attendus :"\r\n                    }\r\n                },\r\n                transactions: {\r\n                    new_title: "Nouvelle Transaction",`,
    `                        expected_income: "Revenus attendus :",\r\n                        buffer_safety: "Marge de sécurité"\r\n                    }\r\n                },\r\n                transactions: {\r\n                    new_title: "Nouvelle Transaction",`,
    'FR dashboard - added forecast buffer_safety'
);

// FR transactions missing keys
replace(
    `                    fortnightly: "Bimensuel"\r\n                },\r\n                summary: {\r\n                    total_balance: "Solde Total",`,
    `                    fortnightly: "Bimensuel",\r\n                    amount: "Montant",\r\n                    date: "Date",\r\n                    no_movements: "Aucune transaction enregistrée",\r\n                    manage_desc: "Contrôlez vos revenus et dépenses en détail."\r\n                },\r\n                summary: {\r\n                    total_balance: "Solde Total",`,
    'FR transactions - added amount, date, no_movements, manage_desc'
);

// FR accounts - add missing keys
replace(
    `                    no_debit_accounts_desc: "Ajoutez vos espèces initiales ou vos comptes de salaire."\r\n                },\r\n                categories: {\r\n                    title: "Catégories",\r\n                    subtitle: "Gérez`,
    `                    no_debit_accounts_desc: "Ajoutez vos espèces initiales ou vos comptes de salaire.",\r\n                    total_assets: "Actifs",\r\n                    total_debts: "Passifs",\r\n                    proportion: "{{percent}}% du total",\r\n                    account_name: "Nom du Compte",\r\n                    account_type: "Type de Compte",\r\n                    add_new: "Ajouter un Compte",\r\n                    available_balance: "Solde Disponible",\r\n                    cash_option: "Espèces",\r\n                    confirm_delete: "Êtes-vous sûr de vouloir supprimer ce compte ?",\r\n                    credit_option: "Carte de Crédit",\r\n                    current_balance: "Solde Actuel",\r\n                    debit_option: "Compte de Débit",\r\n                    delete_desc: "Cette action est irréversible.",\r\n                    distinctive_color: "Couleur Distinctive",\r\n                    edit_desc: "Modifiez les détails de votre compte",\r\n                    initial_debt: "Dette Initiale",\r\n                    investment_option: "Investissement",\r\n                    investment: "Investissement",\r\n                    credit: "Crédit",\r\n                    debit: "Débit",\r\n                    manage: "Gérer les Comptes",\r\n                    manage_subtitle: "Gérez vos comptes, cartes et espèces",\r\n                    payment_day: "Jour de Paiement",\r\n                    installments: "Versements",\r\n                    fortnightly: "Bimensuel",\r\n                    monthly: "Mensuel"\r\n                },\r\n                categories: {\r\n                    title: "Catégories",\r\n                    subtitle: "Gérez`,
    'FR accounts - added all missing keys'
);

// FR budget subtitle
replace(
    `                budget: {\r\n                    title: "Budgets",\r\n                    total_budget: "Budget Total",`,
    `                budget: {\r\n                    title: "Budgets",\r\n                    subtitle: "Planifiez et contrôlez vos dépenses mensuelles",\r\n                    total_budget: "Budget Total",`,
    'FR budget - added subtitle'
);

// FR reports - add missing keys
replace(
    `                reports: {\r\n                    title: "Rapports Avancés",\r\n                    comparative_title: "Comparaison Semestrielle (Revenus vs Dépenses)",\r\n                    income_label: "Revenus",\r\n                    expense_label: "Dépenses"\r\n                }`,
    `                reports: {\r\n                    title: "Rapports Avancés",\r\n                    comparative_title: "Comparaison Semestrielle (Revenus vs Dépenses)",\r\n                    income_label: "Revenus",\r\n                    expense_label: "Dépenses",\r\n                    semiannual_comparison: "Comparaison Semestrielle",\r\n                    expenses_by_category: "Dépenses par Catégorie",\r\n                    financial_health_metrics: "Métriques de Santé Financière",\r\n                    recommended_target: "Objectif Recommandé",\r\n                    average_income: "Revenu Moyen",\r\n                    average_expense: "Dépense Moyenne",\r\n                    savings_rate: "Taux d'Épargne"\r\n                }`,
    'FR reports - added 7 missing keys'
);

// PT reports - add missing keys
replace(
    `                reports: {\r\n                    title: "Relatórios Avançados",\r\n                    comparative_title: "Comparativo Semestral (Receitas vs Despesas)",\r\n                    income_label: "Receitas",\r\n                    expense_label: "Despesas"`,
    `                reports: {\r\n                    title: "Relatórios Avançados",\r\n                    comparative_title: "Comparativo Semestral (Receitas vs Despesas)",\r\n                    income_label: "Receitas",\r\n                    expense_label: "Despesas",\r\n                    semiannual_comparison: "Comparativo Semestral",\r\n                    expenses_by_category: "Despesas por Categoria",\r\n                    financial_health_metrics: "Métricas de Saúde Financeira",\r\n                    recommended_target: "Objetivo Recomendado",\r\n                    average_income: "Receita Média",\r\n                    average_expense: "Gasto Médio",\r\n                    savings_rate: "Taxa de Poupança"`,
    'PT reports - added 7 missing keys'
);

fs.writeFileSync('src/i18n.js', c, 'utf8');
console.log(`\n✅ Total changes: ${changeCount}`);
console.log(`📁 File size: ${originalSize} → ${c.length} bytes (+${c.length - originalSize})`);
