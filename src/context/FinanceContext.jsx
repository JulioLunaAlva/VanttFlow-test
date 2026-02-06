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
    const [netWorthHistory, setNetWorthHistory] = useLocalStorage('finance_net_worth_history', []); // [{ date: '2023-01-01', balance: 1000 }]

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

    // --- NET WORTH LOGIC ---
    // Calculate total net worth at any moment
    const calculateCurrentNetWorth = () => {
        const totalAccounts = accounts.reduce((acc, account) => {
            return acc + getAccountBalance(account.id);
        }, 0);
        return totalAccounts;
    };

    // Helper: Average daily spending (excluding scheduled)
    const getAverageDailySpending = () => {
        if (transactions.length === 0) return 0;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentExpenses = transactions.filter(t =>
            t.type === 'expense' &&
            !t.isScheduled &&
            t.date &&
            parseISO(t.date) >= thirtyDaysAgo
        );

        if (recentExpenses.length === 0) return 0;
        const totalSpent = recentExpenses.reduce((acc, t) => acc + Number(t.amount), 0);
        return totalSpent / 30;
    };

    // --- FORECAST LOGIC ---
    const getForecast = () => {
        const today = new Date();
        const currentBalance = calculateCurrentNetWorth();
        const daysInMonth = lastDayOfMonth(today).getDate();
        const currentDay = today.getDate();
        const daysRemaining = daysInMonth - currentDay;

        // Find scheduled payments pending for this month
        const pendingScheduled = scheduledPayments.filter(p => {
            if (p.status === 'paused') return false;
            // If monthly, check if day is > today
            if (p.frequency === 'monthly') {
                const monthKey = format(today, 'yyyy-MM');
                const isPaid = paymentInstances.some(i => i.scheduledPaymentId === p.id && i.monthKey === monthKey && i.state === 'paid');
                if (isPaid) return false;
                return true;
            }
            if (p.frequency === 'one-time') {
                return new Date(p.descDate) >= today && isSameMonth(new Date(p.descDate), today);
            }
            return false;
        });

        const pendingIncome = pendingScheduled.filter(p => p.type === 'income').reduce((acc, p) => acc + Number(p.amount), 0);
        const pendingExpenses = pendingScheduled.filter(p => p.type === 'expense').reduce((acc, p) => acc + Number(p.amount), 0);

        // Daily spending estimation
        const avgDaily = getAverageDailySpending();
        const estimatedDailyExpenses = avgDaily * daysRemaining;

        const forecastBalance = currentBalance + pendingIncome - pendingExpenses - estimatedDailyExpenses;

        return {
            currentBalance,
            pendingIncome,
            pendingExpenses,
            estimatedDailyExpenses,
            forecastBalance,
            pendingCount: pendingScheduled.length
        };
    };

    // --- VANTT SCORE LOGIC ---
    const getVanttScore = () => {
        let score = 0;
        const details = {
            liquidity: 0,
            debt: 0,
            growth: 0,
            savings: 0,
            discipline: 0
        };

        // 1. Liquidity (Forecast) - Max 200
        const forecast = getForecast();
        if (forecast.forecastBalance > 0) {
            const buffer = forecast.currentBalance > 0 ? (forecast.forecastBalance / forecast.currentBalance) : 1;
            if (buffer > 0.3) details.liquidity = 200;
            else if (buffer > 0.1) details.liquidity = 120;
            else details.liquidity = 40;
        } else {
            details.liquidity = 0;
        }

        // 2. Debt (Credit Utilization) - Max 200
        const creditCards = accounts.filter(a => a.type === 'credit');
        if (creditCards.length > 0) {
            const totalLimit = creditCards.reduce((acc, c) => acc + Number(c.limit || 0), 0);
            const totalDebt = creditCards.reduce((acc, c) => {
                const status = getCreditCardStatus(c.id);
                return acc + (status?.currentDebt || 0);
            }, 0);

            if (totalLimit > 0) {
                const globalUtilization = (totalDebt / totalLimit) * 100;
                if (globalUtilization < 10) details.debt = 200;
                else if (globalUtilization < 30) details.debt = 160;
                else if (globalUtilization < 50) details.debt = 80;
                else if (globalUtilization < 90) details.debt = 40;
                else details.debt = 0;
            } else {
                details.debt = 120;
            }
        } else {
            details.debt = 200;
        }

        // 3. Growth (Net Worth Trend) - Max 200
        if (netWorthHistory.length >= 2) {
            const sorted = [...netWorthHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
            const latest = sorted[sorted.length - 1];
            const prev = sorted[sorted.length - 2];
            if (Number(latest.balance) >= Number(prev.balance)) {
                details.growth = 200;
            } else {
                details.growth = 100;
            }
        } else {
            details.growth = 100;
        }

        // 4. Savings Rate - Max 200
        const { income, expense } = summary;
        if (income > 0) {
            const savingsRate = (income - expense) / income;
            if (savingsRate > 0.20) details.savings = 200;
            else if (savingsRate > 0.10) details.savings = 160;
            else if (savingsRate > 0) details.savings = 100;
            else details.savings = 40;
        } else {
            details.savings = 100;
        }

        // 5. Discipline (Consistency & Budgets) - Max 200
        let disciplineScore = 0;
        const lastTrans = transactions[0];
        if (lastTrans && lastTrans.createdAt) {
            const daysSinceLast = (Date.now() - new Date(lastTrans.createdAt).getTime()) / (1000 * 60 * 60 * 24);
            if (daysSinceLast < 2) disciplineScore += 100;
            else if (daysSinceLast < 5) disciplineScore += 60;
        }

        const budgetStatus = getBudgetStatus();
        if (budgetStatus.length > 0) {
            const overBudgets = budgetStatus.filter(b => b.percentage > 100).length;
            if (overBudgets === 0) disciplineScore += 100;
            else if (overBudgets === 1) disciplineScore += 50;
        } else {
            disciplineScore += 50;
        }
        details.discipline = disciplineScore;

        score = details.liquidity + details.debt + details.growth + details.savings + details.discipline;
        return { total: score, details };
    };

    // --- AI ADVICE LOGIC ---
    const getAIRecommendations = () => {
        const recommendations = [];
        const forecast = getForecast();
        const scoreData = getVanttScore();
        const { income, expense } = summary;
        const monthKey = format(selectedMonth, 'yyyy-MM');

        // 1. Critical Forecast
        if (forecast.forecastBalance < 0) {
            recommendations.push({
                id: 'critical_forecast',
                type: 'danger',
                title_key: 'ai.advice.danger_forecast_title',
                desc_key: 'ai.advice.danger_forecast_desc'
            });
        }

        // 2. Budget Proactivity (Alert at 75% instead of 90%)
        const budgetStatus = getBudgetStatus();
        const overBudget = budgetStatus.find(b => b.percentage > 75);
        if (overBudget) {
            recommendations.push({
                id: 'budget_alert',
                type: 'warning',
                title_key: 'ai.advice.budget_limit_title',
                desc_key: 'ai.advice.budget_limit_desc',
                params: { category: categories.find(c => c.id === overBudget.categoryId)?.name }
            });
        }

        // 3. Spending Trends (AI Insight)
        const spendingAnalysis = getSpendingAnalysis();
        const topTrend = spendingAnalysis.trends.find(t => t.percentageChange > 20);
        if (topTrend) {
            recommendations.push({
                id: 'spending_trend',
                type: 'info',
                title_key: 'ai.advice.trend_increase_title',
                desc_key: 'ai.advice.trend_increase_desc',
                params: {
                    category: categories.find(c => c.id === topTrend.categoryId)?.name,
                    percentage: Math.round(topTrend.percentageChange)
                }
            });
        }

        // 4. Low Savings
        if (income > 0 && (expense / income) > 0.85) {
            recommendations.push({
                id: 'low_savings',
                type: 'warning',
                title_key: 'ai.advice.low_savings_title',
                desc_key: 'ai.advice.low_savings_desc'
            });
        }

        // 5. Success Score
        if (scoreData.total > 750) {
            recommendations.push({
                id: 'great_score',
                type: 'success',
                title_key: 'ai.advice.great_score_title',
                desc_key: 'ai.advice.great_score_desc'
            });
        }

        if (recommendations.length === 0) {
            recommendations.push({
                id: 'default',
                type: 'info',
                title_key: 'ai.advice.default_title',
                desc_key: 'ai.advice.default_desc'
            });
        }

        return recommendations.slice(0, 3);
    };

    const getSpendingAnalysis = () => {
        const monthKey = format(selectedMonth, 'yyyy-MM');
        const currentMonthTransactions = filteredTransactions.filter(t => t.type === 'expense');

        // Group by category
        const categoryTotals = currentMonthTransactions.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
            return acc;
        }, {});

        // Simple trend analysis (compare with last week or average if possible)
        // Here we'll just return top categories and a mock trend for now or 
        // compare vs budget if available
        const trends = Object.entries(categoryTotals).map(([catId, total]) => {
            const budget = budgets.find(b => b.categoryId === catId && b.monthKey === monthKey);
            const budgetAmount = budget ? budget.amount : 0;
            const percentageUsed = budgetAmount > 0 ? (total / budgetAmount) * 100 : 0;

            return {
                categoryId: catId,
                total,
                percentageChange: percentageUsed > 100 ? (percentageUsed - 100) : 0 // Simplified trend
            };
        });

        return {
            totalSpent: currentMonthTransactions.reduce((acc, t) => acc + Number(t.amount), 0),
            categoryTotals,
            trends: trends.sort((a, b) => b.total - a.total)
        };
    };

    // --- ORACLE LOGIC ---
    const simulatePurchase = (amount) => {
        const forecast = getForecast();
        const cost = parseFloat(amount);
        if (isNaN(cost) || cost <= 0) return { status: 'invalid', messageKey: 'dashboard.oracle.msg_invalid' };

        const remainingAfterPurchase = forecast.forecastBalance - cost;

        if (remainingAfterPurchase < 0) {
            return {
                status: 'danger',
                messageKey: 'dashboard.oracle.msg_danger',
                remaining: remainingAfterPurchase
            };
        }

        const buffer = forecast.currentBalance > 0 ? (remainingAfterPurchase / forecast.currentBalance) : 0;

        if (buffer < 0.15) { // Increased safety buffer to 15%
            return {
                status: 'warning',
                messageKey: 'dashboard.oracle.msg_warning',
                remaining: remainingAfterPurchase
            };
        }

        return {
            status: 'safe',
            messageKey: 'dashboard.oracle.msg_safe',
            remaining: remainingAfterPurchase
        };
    };

    // Capture daily snapshot
    React.useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setNetWorthHistory(prev => {
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
        });
    }, [transactions, accounts]); // Update whenever transactions or accounts change? 
    // Ideally we want this to be efficient. Updating on every transaction change ensures 'today' is always accurate.

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
            .filter(t => t.type === 'expense' && !t.isInstallmentTotal)
            .reduce((acc, curr) => acc + Number(curr.amount), 0);

        const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
        const totalExpense = transactions.filter(t => t.type === 'expense' && !t.isInstallmentTotal).reduce((acc, curr) => acc + Number(curr.amount), 0);

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

    const allBalances = useMemo(() => {
        const balances = {};
        accounts.forEach(acc => {
            balances[acc.id] = acc.initialBalance || 0;
        });

        transactions.forEach(t => {
            if (t.isInstallmentTotal) return; // Skip informational total records

            const amount = Number(t.amount);
            if (t.type === 'income' && balances[t.accountId] !== undefined) {
                balances[t.accountId] += amount;
            } else if (t.type === 'expense' && balances[t.accountId] !== undefined) {
                balances[t.accountId] -= amount;
            } else if (t.type === 'transfer') {
                if (balances[t.accountId] !== undefined) balances[t.accountId] -= amount;
                if (balances[t.targetAccountId] !== undefined) balances[t.targetAccountId] += amount;
            }
        });
        return balances;
    }, [transactions, accounts]);

    const getAccountBalance = (accountId) => {
        return allBalances[accountId] || 0;
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
        let startMonthKey = format(new Date(), 'yyyy-MM');
        let endMonthKey = payment.endDate ? format(parseISO(payment.endDate), 'yyyy-MM') : null;

        if (payment.frequency === 'one-time' && payment.descDate) {
            const date = parseISO(payment.descDate);
            startMonthKey = format(date, 'yyyy-MM');
            endMonthKey = startMonthKey; // One-time only exists in its specific month
        }

        const newPayment = {
            ...payment,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
            status: 'active',
            startMonthKey,
            endMonthKey
        };
        setScheduledPayments(prev => [...prev, newPayment]);
        return newPayment;
    };

    /**
     * Registra un gasto en parcialidades.
     * El primer pago se registra como transacción inmediata.
     * Los siguientes se registran como pagos programados.
     */
    const addInstallments = (transaction, installmentOptions) => {
        const { count, frequency } = installmentOptions;
        if (!count || count <= 1) {
            addTransaction(transaction);
            return;
        }

        const amountPerInstallment = Number((transaction.amount / count).toFixed(2));

        // 1. Registro del TOTAL (Informativo, no afecta saldo para evitar duplicidad)
        addTransaction({
            ...transaction,
            description: `${transaction.description} (Total de compra a ${count} meses)`,
            isInstallmentTotal: true, // Flag para ignorar en cálculos de saldo
            installmentMetadata: { count, frequency, amountPerInstallment }
        });

        // 2. Programar como un único registro maestro que se proyecta
        const startDate = transaction.date ? parseISO(transaction.date) : new Date();

        // Calcular fecha fin aproximada para el endMonthKey
        let endDate = new Date(startDate);
        if (frequency === 'monthly') {
            endDate.setMonth(startDate.getMonth() + (count - 1));
        } else {
            endDate.setDate(startDate.getDate() + ((count - 1) * 15));
        }

        addScheduledPayment({
            name: transaction.description,
            amount: amountPerInstallment,
            type: 'expense',
            categoryId: transaction.category,
            accountId: transaction.accountId,
            frequency: frequency, // 'monthly' o 'fortnightly'
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            totalInstallments: count,
            isInstallmentMaster: true
        });

        toast.success(`Compra registrada por un total de ${new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(transaction.amount)} en ${count} pagos.`);
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
            if (p.status === 'paused') return false;
            // Regla general de rango de meses
            if (p.startMonthKey > monthKey) return false;
            if (p.endMonthKey && p.endMonthKey < monthKey) return false;

            return true;
        }).flatMap(p => {
            const daysInMonth = lastDayOfMonth(monthDate).getDate();
            const instances = [];

            // Caso especial: Compra a meses (Installment Master)
            if (p.isInstallmentMaster) {
                const startDate = parseISO(p.startDate);
                let currentIteration = 0;
                let currentDate = new Date(startDate);

                // Proyectar fechas hasta encontrar las que caen en este mes
                while (currentIteration < p.totalInstallments) {
                    const currentMonthKey = format(currentDate, 'yyyy-MM');

                    if (currentMonthKey === monthKey) {
                        const instanceIdMatch = paymentInstances.find(i =>
                            i.scheduledPaymentId === p.id &&
                            i.installmentIndex === currentIteration &&
                            i.monthKey === monthKey
                        );

                        instances.push({
                            ...p,
                            name: `${p.name} (${currentIteration + 1}/${p.totalInstallments})`,
                            currentMonthDate: new Date(currentDate),
                            installmentIndex: currentIteration,
                            state: instanceIdMatch ? instanceIdMatch.state : 'pending',
                            instanceId: instanceIdMatch?.id
                        });
                    }

                    if (currentMonthKey > monthKey) break; // Ya nos pasamos del mes buscado

                    // Siguiente fecha
                    if (p.frequency === 'monthly') {
                        currentDate.setMonth(startDate.getMonth() + (++currentIteration));
                    } else if (p.frequency === 'fortnightly') {
                        currentDate.setDate(startDate.getDate() + (++currentIteration * 15));
                    } else {
                        break; // Evitar loop infinito si falta frecuencia
                    }
                }
                return instances;
            }

            // Caso base: Recurrentes tradicionales (mensual o one-time en su mes)
            let day = p.dayOfMonth;
            if (!day && p.descDate) {
                day = parseISO(p.descDate).getDate();
            }
            day = Math.min(day || 1, daysInMonth);
            const date = setDate(monthDate, day);

            const instanceIdMatch = paymentInstances.find(i => i.scheduledPaymentId === p.id && i.monthKey === monthKey);

            return [{
                ...p,
                currentMonthDate: date,
                state: instanceIdMatch ? instanceIdMatch.state : 'pending',
                instanceId: instanceIdMatch?.id,
                generatedTransactionId: instanceIdMatch?.generatedTransactionId
            }];
        });
    };

    const processScheduledPayment = (payment, action, dateISO = null) => {
        const monthKey = format(selectedMonth, 'yyyy-MM');

        if (action === 'pay') {
            const transactionStr = {
                amount: payment.amount,
                description: `${payment.name} (Pago)`,
                type: payment.type,
                category: payment.categoryId,
                accountId: payment.accountId,
                date: dateISO || payment.currentMonthDate.toISOString(),
                isScheduled: true,
                scheduledPaymentId: payment.id,
                installmentIndex: payment.installmentIndex
            };
            const transId = crypto.randomUUID();
            const newTransaction = { ...transactionStr, id: transId, createdAt: new Date().toISOString() };
            setTransactions(prev => [newTransaction, ...prev]);

            const newInstance = {
                id: crypto.randomUUID(),
                scheduledPaymentId: payment.id,
                installmentIndex: payment.installmentIndex,
                monthKey,
                state: 'paid',
                generatedTransactionId: transId,
                resolvedAt: Date.now()
            };
            setPaymentInstances(prev => [
                ...prev.filter(i => {
                    const isSamePayment = i.scheduledPaymentId === payment.id && i.monthKey === monthKey;
                    const isSameInstallment = payment.installmentIndex !== undefined ? i.installmentIndex === payment.installmentIndex : true;
                    return !(isSamePayment && isSameInstallment);
                }),
                newInstance
            ]);
            toast.success('Pago registrado');
            gainXp(30, 'Responsabilidad cumplida');
        } else if (action === 'skip') {
            const newInstance = {
                id: crypto.randomUUID(),
                scheduledPaymentId: payment.id,
                installmentIndex: payment.installmentIndex,
                monthKey,
                state: 'skipped',
                resolvedAt: Date.now()
            };
            setPaymentInstances(prev => [
                ...prev.filter(i => {
                    const isSamePayment = i.scheduledPaymentId === payment.id && i.monthKey === monthKey;
                    const isSameInstallment = payment.installmentIndex !== undefined ? i.installmentIndex === payment.installmentIndex : true;
                    return !(isSamePayment && isSameInstallment);
                }),
                newInstance
            ]);
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
        getCreditCardStatus,
        getAccountBalance,
        budgets,
        netWorthHistory,
        getForecast,
        getVanttScore,
        getAIRecommendations,
        getSpendingAnalysis,
        simulatePurchase,
        addInstallments
    }), [
        transactions,
        filteredTransactions,
        categories,
        accounts,
        selectedMonth,
        scheduledPayments,
        summary,
        goals,
        budgets,
        netWorthHistory
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
