import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { useIdentity } from "@/context/IdentityContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { subMonths, format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { es, enUS, ptBR, fr } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

export const ReportsPage = () => {
    const { t, i18n } = useTranslation();
    const { transactions, categories } = useFinance();
    const { user } = useIdentity();
    const currency = user?.currency || 'MXN';

    const localeMap = { es, en: enUS, pt: ptBR, fr };
    const currentLocale = localeMap[i18n.language] || es;

    // 1. Datos para Gráfico Histórico (Últimos 6 meses)
    const getHistoricalData = () => {
        const today = new Date();
        const data = [];

        for (let i = 5; i >= 0; i--) {
            const date = subMonths(today, i);
            const monthKey = format(date, 'yyyy-MM');
            const monthName = format(date, 'MMM', { locale: currentLocale });

            // Filter transactions for this month
            // Note: date string comparisons are usually fast enough for YYYY-MM-DD
            const monthTransactions = transactions.filter(t => t.date.startsWith(monthKey));

            const income = monthTransactions
                .filter(t => t.type === 'income')
                .reduce((acc, curr) => acc + Number(curr.amount), 0);

            const expense = monthTransactions
                .filter(t => t.type === 'expense')
                .reduce((acc, curr) => acc + Number(curr.amount), 0);

            data.push({
                name: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                [t('reports.income_label')]: income,
                [t('reports.expense_label')]: expense
            });
        }
        return data;
    };

    const historicalData = getHistoricalData();

    // 2. Breakdown de Gastos por Categoría (Total Histórico vs Mes Actual?)
    // User asked for "Period Visualization". Let's do Current Month Breakdown here too, reusing context?
    // Or Global Breakdown. Let's do Global for "Advanced Reports".

    const getCategoryBreakdown = () => {
        const expenses = transactions.filter(t => t.type === 'expense');
        const byCategory = {};

        expenses.forEach(t => {
            const catId = t.category;
            byCategory[catId] = (byCategory[catId] || 0) + Number(t.amount);
        });

        return Object.entries(byCategory)
            .map(([catId, amount]) => {
                const category = categories.find(c => c.id === catId);
                return {
                    name: category ? category.name : t('common.others'),
                    value: amount,
                    color: category ? category.color : '#94a3b8'
                };
            })
            .sort((a, b) => b.value - a.value)
            .filter(item => item.value > 0);
    };

    const categoryData = getCategoryBreakdown();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-3xl font-bold tracking-tight">{t('reports.title')}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Historical Chart */}
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle>{t('reports.semiannual_comparison')}</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={historicalData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value / 1000}k`}
                                />
                                <Tooltip
                                    formatter={(value) => new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency }).format(value)}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey={t('reports.income_label')} fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey={t('reports.expense_label')} fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Top Categories - All Time */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>{t('reports.expenses_by_category')}</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency }).format(value)} />
                                <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Spending Efficiency Metrics */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>{t('reports.financial_health_metrics')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/* Simple calculations based on historical data average */}
                        {(() => {
                            const totalIncome = historicalData.reduce((acc, curr) => acc + curr.Ingresos, 0);
                            const totalExpense = historicalData.reduce((acc, curr) => acc + curr.Gastos, 0);
                            const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

                            return (
                                <>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">{t('reports.savings_rate')}</span>
                                            <span className={`font-bold ${savingsRate >= 20 ? 'text-green-500' : 'text-yellow-500'}`}>
                                                {savingsRate.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${savingsRate >= 20 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                                style={{ width: `${Math.max(0, Math.min(100, savingsRate))}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {t('reports.recommended_target')}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                        <div>
                                            <p className="text-sm text-muted-foreground">{t('reports.average_income')}</p>
                                            <p className="text-lg font-bold">
                                                {new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(totalIncome / 6)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">{t('reports.average_expense')}</p>
                                            <p className="text-lg font-bold">
                                                {new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(totalExpense / 6)}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </CardContent>
                </Card>
            </div>
        </div >
    );
};
