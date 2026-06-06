import Dexie from 'dexie';

export const db = new Dexie('VanttFlowDB');

db.version(1).stores({
    transactions: 'id, date, category, accountId, type',
    categories: 'id, type',
    accounts: 'id, type',
    scheduledPayments: 'id, status, startMonthKey',
    paymentInstances: 'id, scheduledPaymentId, monthKey',
    budgets: 'id, monthKey, categoryId',
    goals: 'id',
    netWorthHistory: 'date',
    ious: 'id',
    notes: 'id',
    settings: 'id'
});

export const INITIAL_CATEGORIES = [
    { id: 'salary', name: 'Salario', type: 'income', color: '#10b981', icon: 'Wallet' },
    { id: 'freelance', name: 'Freelance', type: 'income', color: '#34d399', icon: 'Laptop' },
    { id: 'investments', name: 'Inversiones', type: 'income', color: '#6ee7b7', icon: 'TrendingUp' },
    { id: 'food', name: 'Comida', type: 'expense', color: '#f87171', icon: 'Utensils' },
    { id: 'transport', name: 'Transporte', type: 'expense', color: '#fb923c', icon: 'Car' },
    { id: 'housing', name: 'Vivienda', type: 'expense', color: '#fbbf24', icon: 'Home' },
    { id: 'utilities', name: 'Servicios', type: 'expense', color: '#facc15', icon: 'Zap' },
    { id: 'entertainment', name: 'Entretenimiento', type: 'expense', color: '#a3e635', icon: 'Gamepad2' },
    { id: 'uber', name: 'Uber/Transporte App', type: 'expense', color: '#000000', icon: 'CarFront' },
    { id: 'health', name: 'Salud', type: 'expense', color: '#4ade80', icon: 'Heart' },
    { id: 'education', name: 'Educación', type: 'expense', color: '#22d3ee', icon: 'GraduationCap' },
    { id: 'shopping', name: 'Compras', type: 'expense', color: '#818cf8', icon: 'ShoppingBag' },
    { id: 'loans', name: 'Préstamos', type: 'both', color: '#60a5fa', icon: 'CreditCard' },
    { id: 'gifts', name: 'Regalos', type: 'expense', color: '#f472b6', icon: 'Gift' },
    { id: 'pets', name: 'Mascotas', type: 'expense', color: '#fb923c', icon: 'Dog' },
    { id: 'travel', name: 'Viajes', type: 'expense', color: '#06b6d4', icon: 'Plane' },
    { id: 'savings', name: 'Ahorro', type: 'expense', color: '#10b981', icon: 'PiggyBank' },
    { id: 'other', name: 'Otros', type: 'both', color: '#94a3b8', icon: 'MoreHorizontal' },
];

export const INITIAL_ACCOUNTS = [
    { id: 'wallet', name: 'Efectivo', initialBalance: 0 },
    { id: 'bank', name: 'Cuenta Bancaria', initialBalance: 0 },
];

export const migrateFromLocalStorage = async () => {
    // Check if migration has already been done
    const isMigrated = localStorage.getItem('vanttflow_db_migrated');
    if (isMigrated === 'true') return;

    try {
        console.log("Starting migration from localStorage to IndexedDB...");

        // Migrate Transactions
        const txs = JSON.parse(localStorage.getItem('finance_transactions') || '[]');
        if (txs.length > 0) await db.transactions.bulkPut(txs);

        // Migrate Categories
        const cats = JSON.parse(localStorage.getItem('finance_categories') || '[]');
        if (cats.length > 0) {
            await db.categories.bulkPut(cats);
        } else {
            await db.categories.bulkPut(INITIAL_CATEGORIES);
        }

        // Migrate Accounts
        const accs = JSON.parse(localStorage.getItem('finance_accounts') || '[]');
        if (accs.length > 0) {
            await db.accounts.bulkPut(accs);
        } else {
            await db.accounts.bulkPut(INITIAL_ACCOUNTS);
        }

        // Migrate Scheduled
        const scheds = JSON.parse(localStorage.getItem('finance_scheduled') || '[]');
        if (scheds.length > 0) await db.scheduledPayments.bulkPut(scheds);

        // Migrate Payment Instances
        const instances = JSON.parse(localStorage.getItem('finance_scheduled_instances') || '[]');
        if (instances.length > 0) await db.paymentInstances.bulkPut(instances);

        // Migrate Budgets
        const buds = JSON.parse(localStorage.getItem('finance_budgets') || '[]');
        if (buds.length > 0) await db.budgets.bulkPut(buds);

        // Migrate Goals
        const gls = JSON.parse(localStorage.getItem('finance_goals') || '[]');
        if (gls.length > 0) await db.goals.bulkPut(gls);

        // Migrate Net Worth
        const nw = JSON.parse(localStorage.getItem('finance_net_worth_history') || '[]');
        if (nw.length > 0) await db.netWorthHistory.bulkPut(nw);

        // Migrate IOUs
        const iousList = JSON.parse(localStorage.getItem('finance_ious') || '[]');
        if (iousList.length > 0) await db.ious.bulkPut(iousList);

        // Migrate Notes
        const nts = JSON.parse(localStorage.getItem('finance_notes') || '[]');
        if (nts.length > 0) await db.notes.bulkPut(nts);

        // Mark as migrated
        localStorage.setItem('vanttflow_db_migrated', 'true');
        console.log("Migration completed successfully.");
    } catch (e) {
        console.error("Migration failed:", e);
    }
};
