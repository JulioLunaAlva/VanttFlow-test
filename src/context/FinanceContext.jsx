import React, { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO, format, setDate, min, lastDayOfMonth, isSameMonth } from 'date-fns';
import { toast } from 'sonner';
import { useGamification } from './GamificationContext';

const FinanceContext = createContext();

const INITIAL_CATEGORIES = [
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
    { id: 'other', name: 'Otros', type: 'both', color: '#94a3b8', icon: 'MoreHorizontal' },
];

const INITIAL_ACCOUNTS = [
    { id: 'wallet', name: 'Efectivo', initialBalance: 0 },
    { id: 'bank', name: 'Cuenta Bancaria', initialBalance: 0 },
];

export const FinanceProvider = ({ children }) => {
    // State
    const [transactions, setTransactions] = useLocalStorage('finance_transactions', []);
    const [categories, setCategories] = useLocalStorage('finance_categories', INITIAL_CATEGORIES);
    const [accounts, setAccounts] = useLocalStorage('finance_accounts', INITIAL_ACCOUNTS);
    const [scheduledPayments, setScheduledPayments] = useLocalStorage('finance_scheduled', []);
    const [paymentInstances, setPaymentInstances] = useLocalStorage('finance_scheduled_instances', []);
    const [budgets, setBudgets] = useLocalStorage('finance_budgets', []); // { monthKey, categoryId, amount }
    const [goals, setGoals] = useLocalStorage('finance_goals', []); // { id, name, targetAmount, currentSaved }

    // Global Filter State
    const [selectedMonth, setSelectedMonth] = React.useState(new Date()); // Date object representing the month

    const { gainXp, unlockAchievement, completeMission } = useGamification();

    // Actions
    // ... (previous actions)

    // --- LOGICA METAS ---
    const addGoal = (goal) => {
        setGoals(prev => [...prev, { ...goal, id: crypto.randomUUID(), createdAt: Date.now() }]);
        toast.success('Meta creada');
        gainXp(20, 'Planificando el futuro');
        unlockAchievement('goal_creator');
        completeMission('add_goal');
    };

    const updateGoal = (id, updates) => {
        setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
        toast.success('Meta actualizada');
    };

    const deleteGoal = (id) => {
        setGoals(prev => prev.filter(g => g.id !== id));
        toast.success('Meta eliminada');
    };

    const exportData = () => {
        if (transactions.length === 0) {
            toast.error('No hay datos para exportar');
            return;
        }

        const headers = ['Fecha', 'Descripción', 'Monto', 'Tipo', 'Categoría', 'Cuenta'];
        const csvContent = [
            headers.join(','),
            ...transactions.map(t => {
                const categoryName = categories.find(c => c.id === t.category)?.name || 'Otros';
                const accountName = accounts.find(a => a.id === t.accountId)?.name || 'General';
                const date = t.date ? format(parseISO(t.date), 'dd/MM/yyyy') : '';
                return `"${date}","${t.description}","${t.amount}","${t.type === 'income' ? 'Ingreso' : 'Gasto'}","${categoryName}","${accountName}"`;
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `finanzas_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Archivo descargado');
    };

    const updateBudget = (categoryId, amount) => {
        const monthKey = format(selectedMonth, 'yyyy-MM');
        setBudgets(prev => {
            const existing = prev.find(b => b.monthKey === monthKey && b.categoryId === categoryId);
            if (existing) {
                // Update
                return prev.map(b => b.id === existing.id ? { ...b, amount } : b);
            } else {
                // Create
                return [...prev, { id: crypto.randomUUID(), monthKey, categoryId, amount }];
            }
        });
        toast.success('Presupuesto actualizado');
        gainXp(15, 'Organizando tus finanzas');
        unlockAchievement('budget_master');
        completeMission('check_budget');
    };

    // Derived Data (Filtered by Month)
    const filteredTransactions = useMemo(() => {
        const start = startOfMonth(selectedMonth);
        const end = endOfMonth(selectedMonth);

        return transactions.filter(t => {
            if (!t.date) return false;
            return isWithinInterval(parseISO(t.date), { start, end });
        });
    }, [transactions, selectedMonth]);

    // Memoized Summary
    const summary = useMemo(() => {
        const income = filteredTransactions
            .filter(t => t.type === 'income')
            .reduce((acc, curr) => acc + Number(curr.amount), 0);

        const expense = filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((acc, curr) => acc + Number(curr.amount), 0);

        const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
        const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);

        const initialBalancesSum = accounts.reduce((acc, curr) => acc + Number(curr.initialBalance || 0), 0);
        const balance = initialBalancesSum + totalIncome - totalExpense;

        return { income, expense, balance };
    }, [filteredTransactions, transactions, accounts]);

    // --- LOGICA CATEGORIAS ---
    const addCategory = (category) => {
        setCategories(prev => [...prev, { ...category, id: crypto.randomUUID() }]);
        toast.success('Categoría creada');
    };

    const updateCategory = (id, updates) => {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
        toast.success('Categoría actualizada');
    };

    const deleteCategory = (id) => {
        const isUsed = transactions.some(t => t.category === id);
        if (isUsed) {
            toast.error('No se puede eliminar: Hay transacciones usando esta categoría');
            return false;
        }
        setCategories(prev => prev.filter(c => c.id !== id));
        toast.success('Categoría eliminada');
        return true;
    };

    // Actions
    const addTransaction = (transaction) => {
        const newTransaction = {
            ...transaction,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString()
        };

        if (transaction.type === 'expense') {
            const date = transaction.date ? parseISO(transaction.date) : new Date();
            const monthKey = format(date, 'yyyy-MM');
            const budget = budgets.find(b => b.monthKey === monthKey && b.categoryId === transaction.category);

            if (budget) {
                const currentSpent = transactions
                    .filter(t => t.type === 'expense' && t.category === transaction.category && t.date?.startsWith(monthKey))
                    .reduce((acc, t) => acc + Number(t.amount), 0);

                const newTotal = currentSpent + Number(transaction.amount);

                if (newTotal > budget.amount) {
                    toast.warning(`⚠️ ¡Atención! Has excedido tu presupuesto de ${categories.find(c => c.id === transaction.category)?.name || 'esta categoría'}.`, {
                        duration: 5000,
                        action: {
                            label: 'Ver',
                            onClick: () => window.location.href = '/budget'
                        }
                    });
                } else if (newTotal > budget.amount * 0.85) {
                    toast('⚠️ Te estás acercando al límite de tu presupuesto.', {
                        description: `Has gastado el ${((newTotal / budget.amount) * 100).toFixed(0)}% de tu límite.`,
                        duration: 4000
                    });
                }
            }
        }

        setTransactions(prev => [newTransaction, ...prev]);
        toast.success('Transacción guardada');
        gainXp(10, 'Registro de actividad');
        unlockAchievement('first_transaction');
        completeMission('reg_trans');
    };

    const deleteTransaction = (id) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
        toast.success('Transacción eliminada');
    };

    const editTransaction = (id, updatedData) => {
        setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
        toast.success('Transacción actualizada');
    };

    const addAccount = (account) => {
        setAccounts(prev => [...prev, {
            ...account,
            id: crypto.randomUUID(),
            type: account.type || 'debit',
            limit: Number(account.limit) || 0,
            color: account.color || '#000000'
        }]);
        toast.success('Cuenta creada');
    };

    const updateAccount = (id, updates) => {
        setAccounts(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
        toast.success('Cuenta actualizada');
    };

    const deleteAccount = (id) => {
        const isUsed = transactions.some(t => t.accountId === id);
        if (isUsed) {
            toast.error('No se puede eliminar: Tiene transacciones asociadas');
            return false;
        }
        setAccounts(prev => prev.filter(a => a.id !== id));
        toast.success('Cuenta eliminada');
        return true;
    };

    const getAccountBalance = (accountId) => {
        const account = accounts.find(a => a.id === accountId);
        if (!account) return 0;

        const balance = account.initialBalance + transactions
            .filter(t => t.accountId === accountId || t.targetAccountId === accountId)
            .reduce((acc, t) => {
                if (t.type === 'income') return acc + Number(t.amount);
                if (t.type === 'expense') return acc - Number(t.amount);
                if (t.type === 'transfer') {
                    if (t.accountId === accountId) return acc - Number(t.amount); // Outgoing
                    if (t.targetAccountId === accountId) return acc + Number(t.amount); // Incoming
                }
                return acc;
            }, 0);
        return balance;
    };

    const getCreditCardStatus = (accountId) => {
        const account = accounts.find(a => a.id === accountId);
        if (!account || account.type !== 'credit') return null;

        const currentBalance = getAccountBalance(accountId);

        // For credit cards, balance is usually negative (debt), or we track debt as positive?
        // In this app, it seems 'debt' was calculated. 
        // If initialBalance is 0, expenses make balance negative.
        // So Debt = Math.abs(balance) if balance < 0.

        const currentDebt = currentBalance < 0 ? Math.abs(currentBalance) : 0;
        const availableCredit = (account.limit || 0) - currentDebt;

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        const paymentDay = parseInt(account.paymentDay) || 15;

        let nextPaymentDate = new Date(currentYear, currentMonth, paymentDay);
        if (today > nextPaymentDate) {
            nextPaymentDate = new Date(currentYear, currentMonth + 1, paymentDay);
        }

        return {
            currentDebt,
            availableCredit,
            nextPaymentDate,
            utilization: account.limit ? (currentDebt / account.limit) * 100 : 0
        };
    };

    // --- LOGICA DE PAGOS PROGRAMADOS ---
    const addScheduledPayment = (payment) => {
        const newPayment = {
            ...payment,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
            status: 'active',
            startMonthKey: format(new Date(), 'yyyy-MM'),
            endMonthKey: payment.endDate ? format(parseISO(payment.endDate), 'yyyy-MM') : null
        };
        setScheduledPayments(prev => [...prev, newPayment]);
        toast.success('Pago programado creado');
        completeMission('add_scheduled');
    };

    const toggleScheduledStatus = (id) => {
        setScheduledPayments(prev => prev.map(p =>
            p.id === id ? { ...p, status: p.status === 'active' ? 'paused' : 'active' } : p
        ));
    };

    const deleteScheduledPayment = (id) => {
        setScheduledPayments(prev => prev.filter(p => p.id !== id));
        toast.success('Pago programado eliminado');
    };

    const getScheduledForMonth = (monthDate) => {
        const monthKey = format(monthDate, 'yyyy-MM');

        return scheduledPayments.filter(p => {
            if (p.startMonthKey > monthKey) return false;
            if (p.endMonthKey && p.endMonthKey < monthKey) return false;
            return true;
        }).map(p => {
            const instance = paymentInstances.find(i => i.scheduledPaymentId === p.id && i.monthKey === monthKey);
            const daysInMonth = lastDayOfMonth(monthDate).getDate();
            const day = Math.min(p.dayOfMonth, daysInMonth);
            const date = setDate(monthDate, day);

            return {
                ...p,
                currentMonthDate: date,
                state: instance ? instance.state : 'pending',
                instanceId: instance?.id,
                generatedTransactionId: instance?.generatedTransactionId
            };
        });
    };

    const processScheduledPayment = (payment, action, dateISO = null) => {
        const monthKey = format(selectedMonth, 'yyyy-MM');

        if (action === 'pay') {
            const transactionStr = {
                amount: payment.amount,
                description: `${payment.name} (Programado)`,
                type: payment.type,
                category: payment.categoryId,
                accountId: payment.accountId,
                date: dateISO || payment.currentMonthDate.toISOString(),
                isScheduled: true
            };
            const transId = crypto.randomUUID();
            const newTransaction = { ...transactionStr, id: transId, createdAt: new Date().toISOString() };
            setTransactions(prev => [newTransaction, ...prev]);

            const newInstance = {
                id: crypto.randomUUID(),
                scheduledPaymentId: payment.id,
                monthKey,
                state: 'paid',
                generatedTransactionId: transId,
                resolvedAt: Date.now()
            };
            setPaymentInstances(prev => [...prev.filter(i => !(i.scheduledPaymentId === payment.id && i.monthKey === monthKey)), newInstance]);
            toast.success('Pago registrado');
            gainXp(30, 'Responsabilidad cumplida');
        } else if (action === 'skip') {
            const newInstance = {
                id: crypto.randomUUID(),
                scheduledPaymentId: payment.id,
                monthKey,
                state: 'skipped',
                resolvedAt: Date.now()
            };
            setPaymentInstances(prev => [...prev.filter(i => !(i.scheduledPaymentId === payment.id && i.monthKey === monthKey)), newInstance]);
            toast.success('Pago omitido');
        }
    };

    const getBudgetStatus = () => {
        const safeBudgets = budgets || [];
        const monthKey = format(selectedMonth, 'yyyy-MM');
        const currentBudgets = safeBudgets.filter(b => b.monthKey === monthKey);

        return currentBudgets.map(budget => {
            const spent = filteredTransactions
                .filter(t => t.type === 'expense' && String(t.category) === String(budget.categoryId))
                .reduce((acc, curr) => acc + Number(curr.amount), 0);

            return {
                ...budget,
                spent,
                remaining: budget.amount - spent,
                percentage: budget.amount > 0 ? (spent / budget.amount) * 100 : 0
            };
        }).sort((a, b) => b.percentage - a.percentage);
    };

    const value = useMemo(() => ({
        transactions,
        filteredTransactions,
        categories,
        accounts,
        selectedMonth,
        setSelectedMonth,
        addTransaction,
        deleteTransaction,
        addAccount,
        scheduledPayments,
        addScheduledPayment,
        toggleScheduledStatus,
        deleteScheduledPayment,
        getScheduledForMonth,
        processScheduledPayment,
        summary,
        updateBudget,
        getBudgetStatus,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        exportData,
        editTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        updateAccount,
        deleteAccount,
        updateAccount,
        deleteAccount,
        getCreditCardStatus,
        getAccountBalance,
        budgets
    }), [
        transactions,
        filteredTransactions,
        categories,
        accounts,
        selectedMonth,
        scheduledPayments,
        summary,
        goals,
        budgets
    ]);

    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    );
};

export const useFinance = () => {
    const context = useContext(FinanceContext);
    if (!context) {
        throw new Error('useFinance must be used within a FinanceProvider');
    }
    return context;
};
