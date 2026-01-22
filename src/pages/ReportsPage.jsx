<<<<<<< HEAD
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { subMonths, format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const ReportsPage = () => {
    const { transactions, categories } = useFinance();

    // 1. Datos para Gráfico Histórico (Últimos 6 meses)
    const getHistoricalData = () => {
        const today = new Date();
        const data = [];

        for (let i = 5; i >= 0; i--) {
            const date = subMonths(today, i);
            const monthKey = format(date, 'yyyy-MM');
            const monthName = format(date, 'MMM', { locale: es });

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
                Ingresos: income,
                Gastos: expense
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
                    name: category ? category.name : 'Otros',
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
            <h1 className="text-3xl font-bold tracking-tight">Reportes Avanzados</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Historical Chart */}
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle>Comparativa Semestral (Ingresos vs Gastos)</CardTitle>
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
                                    formatter={(value) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Top Categories - All Time */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Gastos por Categoría (Histórico)</CardTitle>
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
                                <Tooltip formatter={(value) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)} />
                                <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Spending Efficiency Metrics */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Métricas de Salud Financiera</CardTitle>
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
                                            <span className="text-muted-foreground">Tasa de Ahorro (Semestral)</span>
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
                                            Objetivo recomendado: 20%+
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Promedio Ingresos</p>
                                            <p className="text-lg font-bold">
                                                {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(totalIncome / 6)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Promedio Gastos</p>
                                            <p className="text-lg font-bold">
                                                {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(totalExpense / 6)}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
=======
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { subMonths, format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const ReportsPage = () => {
    const { transactions, categories } = useFinance();

    // 1. Datos para Gráfico Histórico (Últimos 6 meses)
    const getHistoricalData = () => {
        const today = new Date();
        const data = [];

        for (let i = 5; i >= 0; i--) {
            const date = subMonths(today, i);
            const monthKey = format(date, 'yyyy-MM');
            const monthName = format(date, 'MMM', { locale: es });

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
                Ingresos: income,
                Gastos: expense
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
                    name: category ? category.name : 'Otros',
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
            <h1 className="text-3xl font-bold tracking-tight">Reportes Avanzados</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Historical Chart */}
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle>Comparativa Semestral (Ingresos vs Gastos)</CardTitle>
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
                                    formatter={(value) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Top Categories - All Time */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Gastos por Categoría (Histórico)</CardTitle>
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
                                <Tooltip formatter={(value) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)} />
                                <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Spending Efficiency Metrics */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Métricas de Salud Financiera</CardTitle>
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
                                            <span className="text-muted-foreground">Tasa de Ahorro (Semestral)</span>
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
                                            Objetivo recomendado: 20%+
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Promedio Ingresos</p>
                                            <p className="text-lg font-bold">
                                                {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(totalIncome / 6)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Promedio Gastos</p>
                                            <p className="text-lg font-bold">
                                                {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(totalExpense / 6)}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
>>>>>>> 5514d7732ec911852e1fd69f7bbfd09383699edc
