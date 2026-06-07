import React, { createContext, useContext, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, migrateFromLocalStorage, INITIAL_CATEGORIES, INITIAL_ACCOUNTS } from '@/lib/db';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO, format, setDate, min, lastDayOfMonth, isSameMonth } from 'date-fns';
import { toast } from 'sonner';
import { useGamification } from './GamificationContext';
import { toLocalDateStr, parseLocalDateStr } from '@/lib/utils';

const FinanceContext = createContext();





export const FinanceProvider = ({ children }) => {
    const [isDbReady, setIsDbReady] = React.useState(false);

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
    


    // Global Filter State
    const [selectedMonth, setSelectedMonth] = React.useState(new Date()); // Date object representing the month

    const { gainXp, unlockAchievement, completeMission } = useGamification();

    // Actions
    // ... (previous actions)

    // --- LOGICA METAS ---
    const addGoal = (goal) => {
        db.goals.add({ ...goal, id: crypto.randomUUID(), createdAt: Date.now() });
        toast.success('Meta creada');
        gainXp(20, 'Planificando el futuro');
        unlockAchievement('goal_creator');
        completeMission('add_goal');
    };

    const updateGoal = (id, updates) => {
        db.goals.update(id, updates);
        toast.success('Meta actualizada');
    };

    const deleteGoal = (id) => {
        db.goals.delete(id);
        toast.success('Meta eliminada');
    };

    // --- LOGICA IOUs ---
    const addIOU = (iou) => {
        db.ious.add({ ...iou, id: crypto.randomUUID(), amountPaid: 0, status: 'pending', createdAt: Date.now() });
        toast.success('Deuda registrada');
    };

    const editIOU = (id, updates) => {
        db.ious.update(id, updates);
        toast.success('Deuda actualizada');
    };

    const deleteIOU = (id) => {
        db.ious.delete(id);
        toast.success('Registro eliminado');
    };

    const settleIOU = (id, paidAmount, generateTransaction = true) => {
        const iou = ious.find(i => i.id === id);
        if (!iou) return;
        const newPaid = Number(iou.amountPaid || 0) + Number(paidAmount);
        const newStatus = newPaid >= Number(iou.amount) ? 'settled' : 'partial';
        db.ious.update(id, { amountPaid: newPaid, status: newStatus });
        if (generateTransaction && iou.type === 'lent') {
            // Cobrar una deuda genera un ingreso
            addTransaction({
                amount: paidAmount,
                description: `Cobro a ${iou.personName}: ${iou.description}`,
                type: 'income',
                category: 'loans',
                accountId: accounts[0]?.id,
                date: toLocalDateStr()
            });
        }
        toast.success(newStatus === 'settled' ? '¡Deuda saldada! ✅' : 'Pago parcial registrado');
    };

    // --- LOGICA NOTAS ---
    const addNote = (note) => {
        db.notes.add({ ...note, id: crypto.randomUUID(), pinned: false, archived: false, createdAt: Date.now() });
        toast.success('Nota creada');
    };

    const editNote = (id, updates) => {
        db.notes.update(id, updates);
    };

    const deleteNote = (id) => {
        db.notes.delete(id);
        toast.success('Nota eliminada');
    };

    const togglePinNote = (id) => {
        const n = notes.find(x => x.id === id); if(n) db.notes.update(id, { pinned: !n.pinned });
    };

    const archiveNote = (id) => {
        const n = notes.find(x => x.id === id); if(n) db.notes.update(id, { archived: !n.archived });
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
                const date = t.date ? format(parseLocalDateStr(t.date), 'dd/MM/yyyy') : '';
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
        const existing = budgets.find(b => b.monthKey === monthKey && b.categoryId === categoryId);
        if (existing) {
            db.budgets.update(existing.id, { amount });
        } else {
            db.budgets.add({ id: crypto.randomUUID(), monthKey, categoryId, amount });
        }
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
            parseLocalDateStr(t.date) >= thirtyDaysAgo
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
                return parseLocalDateStr(p.descDate) >= today && isSameMonth(parseLocalDateStr(p.descDate), today);
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
            const sorted = [...netWorthHistory].sort((a, b) => parseLocalDateStr(a.date) - parseLocalDateStr(b.date));
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
            const daysSinceLast = (Date.now() - new Date(lastTrans.createdAt || lastTrans.date).getTime()) / (1000 * 60 * 60 * 24);
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
        const today = toLocalDateStr();
        const hasToday = netWorthHistory.find(item => item.date === today);
            const currentWorth = accounts.reduce((acc, account) => {
                return acc + getAccountBalance(account.id);
            }, 0);

            if (hasToday) {
                db.netWorthHistory.put({ date: today, balance: currentWorth });
            } else {
                db.netWorthHistory.put({ date: today, balance: currentWorth });
            }
    }, [transactions, accounts]); // Update whenever transactions or accounts change? 
    // Ideally we want this to be efficient. Updating on every transaction change ensures 'today' is always accurate.

    // Derived Data (Filtered by Month)
    const filteredTransactions = useMemo(() => {
        const start = startOfMonth(selectedMonth);
        const end = endOfMonth(selectedMonth);

        return transactions.filter(t => {
            if (!t.date) return false;
            // Ensure we use the local date parsing to avoid TZ shifts
            const txDate = parseLocalDateStr(t.date);
            return isWithinInterval(txDate, { start, end });
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
        db.categories.add({ ...category, id: crypto.randomUUID() });
        toast.success('Categoría creada');
    };

    const updateCategory = (id, updates) => {
        db.categories.update(id, updates);
        toast.success('Categoría actualizada');
    };

    const deleteCategory = (id) => {
        const isUsed = transactions.some(t => t.category === id);
        if (isUsed) {
            toast.error('No se puede eliminar: Hay transacciones usando esta categoría');
            return false;
        }
        db.categories.delete(id);
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
            const date = transaction.date ? parseLocalDateStr(transaction.date) : new Date();
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

        db.transactions.add(newTransaction);
        toast.success('Transacción guardada');
        gainXp(10, 'Registro de actividad');
        unlockAchievement('first_transaction');
        completeMission('reg_trans');
    };

    const deleteTransaction = (id) => {
        db.transactions.delete(id);
        toast.success('Transacción eliminada');
    };

    const editTransaction = (id, updatedData) => {
        db.transactions.update(id, updatedData);
        toast.success('Transacción actualizada');
    };

    const addAccount = (account) => {
        db.accounts.add({
            ...account,
            id: crypto.randomUUID(),
            type: account.type || 'debit',
            limit: Number(account.limit) || 0,
            color: account.color || '#000000'
        });
        toast.success('Cuenta creada');
    };

    const updateAccount = (id, updates) => {
        db.accounts.update(id, updates);
        toast.success('Cuenta actualizada');
    };

    const deleteAccount = (id) => {
        const isUsed = transactions.some(t => t.accountId === id);
        if (isUsed) {
            toast.error('No se puede eliminar: Tiene transacciones asociadas');
            return false;
        }
        db.accounts.delete(id);
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
        let endMonthKey = payment.endDate ? format(parseLocalDateStr(payment.endDate), 'yyyy-MM') : null;

        if (payment.frequency === 'one-time' && payment.descDate) {
            const date = parseLocalDateStr(payment.descDate);
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
        db.scheduledPayments.add(newPayment);
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
        const startDate = transaction.date ? parseLocalDateStr(transaction.date) : new Date();

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
        const p = scheduledPayments.find(x => x.id === id); if(p) db.scheduledPayments.update(id, { status: p.status === 'active' ? 'paused' : 'active' });
    };

    const deleteScheduledPayment = (id) => {
        db.scheduledPayments.delete(id);
        toast.success('Pago programado eliminado');
    };

    const updateScheduledPayment = (id, updates) => {
        db.scheduledPayments.update(id, updates);
        toast.success('Pago actualizado');
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
                const startDate = parseLocalDateStr(p.startDate);
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
                day = parseLocalDateStr(p.descDate).getDate();
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
            db.transactions.add(newTransaction);

            const newInstance = {
                id: crypto.randomUUID(),
                scheduledPaymentId: payment.id,
                installmentIndex: payment.installmentIndex,
                monthKey,
                state: 'paid',
                generatedTransactionId: transId,
                resolvedAt: Date.now()
            };
            const existing = paymentInstances.find(i => {
                const isSamePayment = i.scheduledPaymentId === payment.id && i.monthKey === monthKey;
                const isSameInstallment = payment.installmentIndex !== undefined ? i.installmentIndex === payment.installmentIndex : true;
                return isSamePayment && isSameInstallment;
            });
            if (existing) {
                db.paymentInstances.delete(existing.id).then(() => db.paymentInstances.add(newInstance));
            } else {
                db.paymentInstances.add(newInstance);
            }
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
            const existing = paymentInstances.find(i => {
                const isSamePayment = i.scheduledPaymentId === payment.id && i.monthKey === monthKey;
                const isSameInstallment = payment.installmentIndex !== undefined ? i.installmentIndex === payment.installmentIndex : true;
                return isSamePayment && isSameInstallment;
            });
            if (existing) {
                db.paymentInstances.delete(existing.id).then(() => db.paymentInstances.add(newInstance));
            } else {
                db.paymentInstances.add(newInstance);
            }
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

    const formatCurrency = (amount, options = {}) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            notation: options.compact ? "compact" : "standard",
            ...options
        }).format(amount || 0);
    };

    const value = useMemo(() => ({
        formatCurrency,
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
        updateScheduledPayment,
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
        getSpendingAnalysis,
        simulatePurchase,
        addInstallments,
        ious,
        addIOU,
        editIOU,
        deleteIOU,
        settleIOU,
        notes,
        addNote,
        editNote,
        deleteNote,
        togglePinNote,
        archiveNote,
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
        netWorthHistory,
        ious,
        notes,
    ]);

    return (
        <FinanceContext.Provider value={value}>
            {!isDbReady ? (
                <div className="flex items-center justify-center h-screen w-screen bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
                children
            )}
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
