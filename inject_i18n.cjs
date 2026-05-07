const fs = require('fs');
let content = fs.readFileSync('src/i18n.js', 'utf8');

const additionalTranslations = {
    accounts: {
        account_name: 'Nombre de Cuenta',
        account_type: 'Tipo de Cuenta',
        add_new: 'Agregar Cuenta',
        available_balance: 'Saldo Disponible',
        cash_option: 'Efectivo',
        confirm_delete: '¿Estás seguro de eliminar esta cuenta?',
        credit: 'Crédito',
        credit_option: 'Tarjeta de Crédito',
        current_balance: 'Saldo Actual',
        debit: 'Débito',
        debit_option: 'Cuenta de Débito',
        delete_desc: 'Esta acción no se puede deshacer.',
        distinctive_color: 'Color Distintivo',
        edit_desc: 'Modifica los detalles de tu cuenta',
        initial_debt: 'Deuda Inicial',
        investment: 'Inversión',
        investment_option: 'Inversión',
        manage: 'Gestionar Cuentas',
        manage_subtitle: 'Administra tus cuentas, tarjetas y efectivo',
        payment_day: 'Día de Pago'
    },
    reports: {
        average_expense: 'Gasto Promedio',
        average_income: 'Ingreso Promedio',
        expenses_by_category: 'Gastos por Categoría',
        financial_health_metrics: 'Métricas de Salud Financiera',
        recommended_target: 'Objetivo Recomendado',
        savings_rate: 'Tasa de Ahorro',
        semiannual_comparison: 'Comparativa Semestral'
    }
};

function inject(key, objStr) {
    const rx = new RegExp(key + ':\\s*\\{');
    content = content.replace(rx, key + ': {\n' + objStr + ',');
}

// Inject new top-level objects
const newObjs = ['accounts', 'reports'].map(k => '"' + k + '": ' + JSON.stringify(additionalTranslations[k])).join(',\n');
content = content.replace('translation: {', 'translation: {\n' + newObjs + ',');

// Inject into common
const commonInject = '"delete": "Eliminar", "great_job": "¡Buen trabajo!", "more": "Más", "others": "Otros"';
inject('common', commonInject);

// Inject into dashboard
const dashboardInject = '"more_goals_count": "metas más", "no_accounts": "Sin Cuentas", "saved_amount": "Ahorrado"';
inject('dashboard', dashboardInject);

// Inject into budget
const budgetInject = '"subtitle": "Planifica y controla tus gastos mensuales"';
inject('budget', budgetInject);

// Inject into transactions
const transInject = '"manage_desc": "Registra y controla tus movimientos financieros", "no_movements": "No hay movimientos registrados", "amount": "Monto", "date": "Fecha"';
inject('transactions', transInject);

// Inject into scheduled
const schedInject = '"date": "Fecha"';
inject('scheduled', schedInject);

// Inject flat keys into translation
content = content.replace('translation: {', 'translation: {\n"first_transaction": "Primer Paso", "goal_creator": "Arquitecto de Sueños", "budget_master": "Control Total", "saving_streak": "Racha Imparable",');

fs.writeFileSync('src/i18n.js', content);
console.log('Injected translations successfully.');
