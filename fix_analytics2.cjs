const fs = require('fs');
let content = fs.readFileSync('src/i18n.js', 'utf8');

const analyticsTranslations = {
    title: 'Analíticas',
    comparing: 'Comparando {{current}} vs {{previous}}',
    patrimony_evolution: 'Evolución de Patrimonio',
    patrimony: 'Patrimonio',
    empty_history: 'Historial Vacío',
    empty_history_sub: 'Tus datos de balance aparecerán aquí',
    cash_flow_title: 'Flujo de Caja Histórico',
    savings_summary: 'Resumen de Ahorro',
    net_savings: 'Ahorro Neto (Este Mes)',
    of_income_spent: 'de tus ingresos han sido gastados',
    no_income_data: 'Sin datos de ingresos para este mes',
    total_expense: 'Gasto Total',
    vs_previous_short: 'vs mes anterior',
    income: 'Ingresos',
    no_significant_changes: 'Sin cambios significativos',
    biggest_increase: 'Mayor Incremento',
    increase_desc: '{{category}} subió de {{prev}} a {{curr}}',
    category_breakdown: 'Desglose por Categorías',
    monthly_spend: 'Gasto Mensual',
    no_data: 'Sin Datos'
};

const regex = /"analytics":\s*\{[^}]*\}/g;
if (regex.test(content)) {
    // Replace existing analytics block
    content = content.replace(regex, '"analytics": ' + JSON.stringify(analyticsTranslations, null, 4));
} else {
    // Inject if not exists
    content = content.replace('translation: {', 'translation: {\n"analytics": ' + JSON.stringify(analyticsTranslations, null, 4) + ',');
}

fs.writeFileSync('src/i18n.js', content);
console.log('Injected analytics block successfully.');
