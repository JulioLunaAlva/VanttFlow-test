import re

file_path = 'src/context/FinanceContext.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
content = content.replace(
    "import { useLocalStorage } from '@/hooks/useLocalStorage';",
    "import { useLiveQuery } from 'dexie-react-hooks';\nimport { db, migrateFromLocalStorage, INITIAL_CATEGORIES, INITIAL_ACCOUNTS } from '@/lib/db';"
)

# 2. INITIAL_CATEGORIES and INITIAL_ACCOUNTS removal
# We will just remove the definitions of INITIAL_CATEGORIES and INITIAL_ACCOUNTS from here since they are in db.js
content = re.sub(r'const INITIAL_CATEGORIES = \[.*?\];', '', content, flags=re.DOTALL)
content = re.sub(r'const INITIAL_ACCOUNTS = \[.*?\];', '', content, flags=re.DOTALL)

# 3. State initialization
old_state = """    // State
    const [transactions, setTransactions] = useLocalStorage('finance_transactions', []);
    const [categories, setCategories] = useLocalStorage('finance_categories', INITIAL_CATEGORIES);
    const [accounts, setAccounts] = useLocalStorage('finance_accounts', INITIAL_ACCOUNTS);
    const [scheduledPayments, setScheduledPayments] = useLocalStorage('finance_scheduled', []);
    const [paymentInstances, setPaymentInstances] = useLocalStorage('finance_scheduled_instances', []);
    const [budgets, setBudgets] = useLocalStorage('finance_budgets', []); // { monthKey, categoryId, amount }
    const [goals, setGoals] = useLocalStorage('finance_goals', []); // { id, name, targetAmount, currentSaved }
    const [netWorthHistory, setNetWorthHistory] = useLocalStorage('finance_net_worth_history', []); // [{ date: '2023-01-01', balance: 1000 }]
    const [ious, setIous] = useLocalStorage('finance_ious', []); // { id, personName, type, amount, description, date, status, amountPaid }
    const [notes, setNotes] = useLocalStorage('finance_notes', []); // { id, title, body, color, pinned, archived, createdAt }"""

new_state = """    const [isDbReady, setIsDbReady] = React.useState(false);

    React.useEffect(() => {
        migrateFromLocalStorage().then(() => setIsDbReady(true));
    }, []);

    // State from Dexie
    const transactions = useLiveQuery(() => db.transactions.toArray(), [], []) || [];
    const categories = useLiveQuery(() => db.categories.toArray(), [], INITIAL_CATEGORIES) || INITIAL_CATEGORIES;
    const accounts = useLiveQuery(() => db.accounts.toArray(), [], INITIAL_ACCOUNTS) || INITIAL_ACCOUNTS;
    const scheduledPayments = useLiveQuery(() => db.scheduledPayments.toArray(), [], []) || [];
    const paymentInstances = useLiveQuery(() => db.paymentInstances.toArray(), [], []) || [];
    const budgets = useLiveQuery(() => db.budgets.toArray(), [], []) || [];
    const goals = useLiveQuery(() => db.goals.toArray(), [], []) || [];
    const netWorthHistory = useLiveQuery(() => db.netWorthHistory.toArray(), [], []) || [];
    const ious = useLiveQuery(() => db.ious.toArray(), [], []) || [];
    const notes = useLiveQuery(() => db.notes.toArray(), [], []) || [];
    
    if (!isDbReady) {
        return <div className="flex items-center justify-center h-screen w-screen bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }"""
content = content.replace(old_state, new_state)

# 4. Mutators
replacements = [
    # Goals
    ("setGoals(prev => [...prev, { ...goal, id: crypto.randomUUID(), createdAt: Date.now() }]);", "db.goals.add({ ...goal, id: crypto.randomUUID(), createdAt: Date.now() });"),
    ("setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));", "db.goals.update(id, updates);"),
    ("setGoals(prev => prev.filter(g => g.id !== id));", "db.goals.delete(id);"),
    # IOUs
    ("setIous(prev => [...prev, { ...iou, id: crypto.randomUUID(), amountPaid: 0, status: 'pending', createdAt: Date.now() }]);", "db.ious.add({ ...iou, id: crypto.randomUUID(), amountPaid: 0, status: 'pending', createdAt: Date.now() });"),
    ("setIous(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));", "db.ious.update(id, updates);"),
    ("setIous(prev => prev.filter(i => i.id !== id));", "db.ious.delete(id);"),
    ("setIous(prev => prev.map(i => i.id === id ? { ...i, amountPaid: newPaid, status: newStatus } : i));", "db.ious.update(id, { amountPaid: newPaid, status: newStatus });"),
    # Notes
    ("setNotes(prev => [...prev, { ...note, id: crypto.randomUUID(), pinned: false, archived: false, createdAt: Date.now() }]);", "db.notes.add({ ...note, id: crypto.randomUUID(), pinned: false, archived: false, createdAt: Date.now() });"),
    ("setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));", "db.notes.update(id, updates);"),
    ("setNotes(prev => prev.filter(n => n.id !== id));", "db.notes.delete(id);"),
    ("setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));", "const n = notes.find(x => x.id === id); if(n) db.notes.update(id, { pinned: !n.pinned });"),
    ("setNotes(prev => prev.map(n => n.id === id ? { ...n, archived: !n.archived } : n));", "const n = notes.find(x => x.id === id); if(n) db.notes.update(id, { archived: !n.archived });"),
    # Budgets
    ("""setBudgets(prev => {
            const existing = prev.find(b => b.monthKey === monthKey && b.categoryId === categoryId);
            if (existing) {
                // Update
                return prev.map(b => b.id === existing.id ? { ...b, amount } : b);
            } else {
                // Create
                return [...prev, { id: crypto.randomUUID(), monthKey, categoryId, amount }];
            }
        });""", """const existing = budgets.find(b => b.monthKey === monthKey && b.categoryId === categoryId);
        if (existing) {
            db.budgets.update(existing.id, { amount });
        } else {
            db.budgets.add({ id: crypto.randomUUID(), monthKey, categoryId, amount });
        }"""),
    # Categories
    ("setCategories(prev => [...prev, { ...category, id: crypto.randomUUID() }]);", "db.categories.add({ ...category, id: crypto.randomUUID() });"),
    ("setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));", "db.categories.update(id, updates);"),
    ("setCategories(prev => prev.filter(c => c.id !== id));", "db.categories.delete(id);"),
    # Transactions
    ("setTransactions(prev => [newTransaction, ...prev]);", "db.transactions.add(newTransaction);"),
    ("setTransactions(prev => prev.filter(t => t.id !== id));", "db.transactions.delete(id);"),
    ("setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));", "db.transactions.update(id, updatedData);"),
    # Accounts
    ("""setAccounts(prev => [...prev, {
            ...account,
            id: crypto.randomUUID(),
            type: account.type || 'debit',
            limit: Number(account.limit) || 0,
            color: account.color || '#000000'
        }]);""", """db.accounts.add({
            ...account,
            id: crypto.randomUUID(),
            type: account.type || 'debit',
            limit: Number(account.limit) || 0,
            color: account.color || '#000000'
        });"""),
    ("setAccounts(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));", "db.accounts.update(id, updates);"),
    ("setAccounts(prev => prev.filter(a => a.id !== id));", "db.accounts.delete(id);"),
    # Scheduled Payments
    ("setScheduledPayments(prev => [...prev, newPayment]);", "db.scheduledPayments.add(newPayment);"),
    ("setScheduledPayments(prev => prev.map(p =>\n            p.id === id ? { ...p, status: p.status === 'active' ? 'paused' : 'active' } : p\n        ));", "const p = scheduledPayments.find(x => x.id === id); if(p) db.scheduledPayments.update(id, { status: p.status === 'active' ? 'paused' : 'active' });"),
    ("setScheduledPayments(prev => prev.filter(p => p.id !== id));", "db.scheduledPayments.delete(id);"),
]

for old, new in replacements:
    content = content.replace(old, new)

# 5. NetWorthHistory complex replacement
old_networth = """setNetWorthHistory(prev => {
            // Check if we already have a snapshot for today
            const hasToday = prev.find(item => item.date === today);

            // Calculate current worth
            const currentWorth = accounts.reduce((acc, account) => {
                // For credit cards, balance is negative if used, so it correctly subtracts from net worth
                // For debit/cash, balance is positive.
                return acc + getAccountBalance(account.id);
            }, 0);

            if (hasToday) {
                // Optional: Update today's value if it changed? 
                // Let's update it so it's always fresh for the current day until the day passes.
                return prev.map(item => item.date === today ? { ...item, balance: currentWorth } : item);
            } else {
                // Add new snapshot
                // Limit history to last 365 days to save space? Nah, localStorage can handle it for a while.
                return [...prev, { date: today, balance: currentWorth }];
            }
        });"""

new_networth = """const hasToday = netWorthHistory.find(item => item.date === today);
            const currentWorth = accounts.reduce((acc, account) => {
                return acc + getAccountBalance(account.id);
            }, 0);

            if (hasToday) {
                db.netWorthHistory.put({ date: today, balance: currentWorth });
            } else {
                db.netWorthHistory.put({ date: today, balance: currentWorth });
            }"""
            
content = content.replace(old_networth, new_networth)

# 6. Payment Instances mutators (if any in processScheduledPayment)
content = content.replace("setPaymentInstances(prev => [...prev, instance]);", "db.paymentInstances.add(instance);")

# Save
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("FinanceContext.jsx refactored for Dexie.")
