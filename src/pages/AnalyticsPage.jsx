<<<<<<< HEAD
import React from 'react';
import { useFinance } from "@/context/FinanceContext";
import { useGamification } from "@/context/GamificationContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Minus, BarChart2 } from 'lucide-react';
import { format, subMonths, isSameMonth, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const AnalyticsPage = () => {
    const { transactions, selectedMonth, categories } = useFinance();
    const { completeMission } = useGamification();

    React.useEffect(() => {
        completeMission('visit_analytics');
    }, []);

    // 1. Determine comparison months
    const currentMonthDate = selectedMonth;
    const previousMonthDate = subMonths(selectedMonth, 1);

    // 2. Filter Data
    const getMonthData = (date) => {
        return transactions.filter(t => isSameMonth(parseISO(t.date), date));
    };

    const currentData = getMonthData(currentMonthDate);
    const previousData = getMonthData(previousMonthDate);

    // 3. Calculate Totals
    const calculateTotal = (data, type) => data.filter(t => t.type === type).reduce((acc, curr) => acc + Number(curr.amount), 0);

    const currentExpense = calculateTotal(currentData, 'expense');
    const previousExpense = calculateTotal(previousData, 'expense');

    const currentIncome = calculateTotal(currentData, 'income');
    const previousIncome = calculateTotal(previousData, 'income');

    // 4. Calculate Variations
    const calculateVariation = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    };

    const expenseVariation = calculateVariation(currentExpense, previousExpense);
    const incomeVariation = calculateVariation(currentIncome, previousIncome);

    // 5. Category Breakdown
    const getCategoryBreakdown = (data) => {
        const breakdown = {};
        data.filter(t => t.type === 'expense').forEach(t => {
            breakdown[t.category] = (breakdown[t.category] || 0) + Number(t.amount);
        });
        return breakdown;
    };

    const currentBreakdown = getCategoryBreakdown(currentData);
    const previousBreakdown = getCategoryBreakdown(previousData);

    // Default Categories list to iterate (union of both months)
    const allCategoryIds = [...new Set([...Object.keys(currentBreakdown), ...Object.keys(previousBreakdown)])];

    const categoryInsights = allCategoryIds.map(catId => {
        const current = currentBreakdown[catId] || 0;
        const previous = previousBreakdown[catId] || 0;
        const variation = calculateVariation(current, previous);
        const category = categories.find(c => c.id === catId);

        return {
            id: catId,
            name: category?.name || 'Otros',
            icon: category?.icon,
            color: category?.color || '#94a3b8',
            current,
            previous,
            variation,
            diff: current - previous
        };
    }).sort((a, b) => b.current - a.current); // Sort by highest spending this month

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Analíticas Mensuales</h2>
                    <p className="text-muted-foreground capitalize">
                        Comparando {format(currentMonthDate, 'MMMM yyyy', { locale: es })} vs {format(previousMonthDate, 'MMMM yyyy', { locale: es })}
                    </p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Gasto Total</CardTitle>
                        <TrendingDown size={16} className={expenseVariation > 0 ? "text-red-500" : "text-green-500"} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(currentExpense)}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            {expenseVariation > 0 ? <ArrowUpRight size={12} className="text-red-500" /> : <ArrowDownRight size={12} className="text-green-500" />}
                            <span className={expenseVariation > 0 ? "text-red-500 font-medium" : "text-green-500 font-medium"}>
                                {Math.abs(expenseVariation).toFixed(1)}%
                            </span>
                            vs mes anterior ({new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(previousExpense)})
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
                        <TrendingUp size={16} className={incomeVariation >= 0 ? "text-green-500" : "text-red-500"} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(currentIncome)}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            {incomeVariation >= 0 ? <ArrowUpRight size={12} className="text-green-500" /> : <ArrowDownRight size={12} className="text-red-500" />}
                            <span className={incomeVariation >= 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                                {Math.abs(incomeVariation).toFixed(1)}%
                            </span>
                            vs mes anterior
                        </p>
                    </CardContent>
                </Card>

                {/* Insight Card: Highest Increase */}
                {(() => {
                    const highestIncrease = [...categoryInsights].sort((a, b) => b.diff - a.diff)[0];
                    if (!highestIncrease || highestIncrease.diff <= 0) return (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Mayor Cambio</CardTitle>
                                <Minus size={16} />
                            </CardHeader>
                            <CardContent className="py-6 text-center text-muted-foreground text-sm">
                                Sin aumentos significativos.
                            </CardContent>
                        </Card>
                    );

                    return (
                        <Card className="bg-destructive/10 border-destructive/20">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-destructive">Mayor Aumento</CardTitle>
                                <TrendingUp size={16} className="text-destructive" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-lg font-bold truncate">{highestIncrease.name}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Gastaste <span className="font-bold text-destructive">+${highestIncrease.diff.toLocaleString('es-MX')}</span> más que el mes pasado.
                                </p>
                            </CardContent>
                        </Card>
                    );
                })()}
            </div>

            {/* Detailed Category Comparison */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart2 size={20} /> Desglose por Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {categoryInsights.map(cat => (
                            <div key={cat.id} className="group">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                        <span className="font-medium text-sm">{cat.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-sm block">${cat.current.toLocaleString('es-MX')}</span>
                                        <span className={`text-xs flex items-center justify-end gap-1 ${cat.diff > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                            {cat.diff > 0 ? '+' : ''}{cat.diff.toLocaleString('es-MX')} ({cat.variation.toFixed(0)}%)
                                        </span>
                                    </div>
                                </div>

                                {/* Comparison Bar */}
                                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                                    {/* Previous Month Marker (Background Bar) */}
                                    {/* We need a scale. Let's use max of current/previous as 100% relative to THIS category max? No, max of ALL categories. */}
                                    {(() => {
                                        const maxVal = Math.max(...categoryInsights.map(c => Math.max(c.current, c.previous)));
                                        const curWidth = (cat.current / maxVal) * 100;
                                        const prevWidth = (cat.previous / maxVal) * 100;

                                        return (
                                            <>
                                                {/* Previous Month (Ghost bar) */}
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-foreground/10 z-10"
                                                    style={{ width: `${prevWidth}%` }}
                                                    title={`Mes Anterior: $${cat.previous}`}
                                                />
                                                {/* Current Month */}
                                                <div
                                                    className="absolute top-0 left-0 h-full z-20 opacity-80"
                                                    style={{
                                                        width: `${curWidth}%`,
                                                        backgroundColor: cat.color
                                                    }}
                                                    title={`Mes Actual: $${cat.current}`}
                                                />
                                            </>
                                        )
                                    })()}
                                </div>
                            </div>
                        ))}
                        {categoryInsights.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No hay datos de gastos para comparar en este periodo.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
=======
import React from 'react';
import { useFinance } from "@/context/FinanceContext";
import { useGamification } from "@/context/GamificationContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Minus, BarChart2 } from 'lucide-react';
import { format, subMonths, isSameMonth, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const AnalyticsPage = () => {
    const { transactions, selectedMonth, categories } = useFinance();
    const { completeMission } = useGamification();

    React.useEffect(() => {
        completeMission('visit_analytics');
    }, []);

    // 1. Determine comparison months
    const currentMonthDate = selectedMonth;
    const previousMonthDate = subMonths(selectedMonth, 1);

    // 2. Filter Data
    const getMonthData = (date) => {
        return transactions.filter(t => isSameMonth(parseISO(t.date), date));
    };

    const currentData = getMonthData(currentMonthDate);
    const previousData = getMonthData(previousMonthDate);

    // 3. Calculate Totals
    const calculateTotal = (data, type) => data.filter(t => t.type === type).reduce((acc, curr) => acc + Number(curr.amount), 0);

    const currentExpense = calculateTotal(currentData, 'expense');
    const previousExpense = calculateTotal(previousData, 'expense');

    const currentIncome = calculateTotal(currentData, 'income');
    const previousIncome = calculateTotal(previousData, 'income');

    // 4. Calculate Variations
    const calculateVariation = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    };

    const expenseVariation = calculateVariation(currentExpense, previousExpense);
    const incomeVariation = calculateVariation(currentIncome, previousIncome);

    // 5. Category Breakdown
    const getCategoryBreakdown = (data) => {
        const breakdown = {};
        data.filter(t => t.type === 'expense').forEach(t => {
            breakdown[t.category] = (breakdown[t.category] || 0) + Number(t.amount);
        });
        return breakdown;
    };

    const currentBreakdown = getCategoryBreakdown(currentData);
    const previousBreakdown = getCategoryBreakdown(previousData);

    // Default Categories list to iterate (union of both months)
    const allCategoryIds = [...new Set([...Object.keys(currentBreakdown), ...Object.keys(previousBreakdown)])];

    const categoryInsights = allCategoryIds.map(catId => {
        const current = currentBreakdown[catId] || 0;
        const previous = previousBreakdown[catId] || 0;
        const variation = calculateVariation(current, previous);
        const category = categories.find(c => c.id === catId);

        return {
            id: catId,
            name: category?.name || 'Otros',
            icon: category?.icon,
            color: category?.color || '#94a3b8',
            current,
            previous,
            variation,
            diff: current - previous
        };
    }).sort((a, b) => b.current - a.current); // Sort by highest spending this month

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Analíticas Mensuales</h2>
                    <p className="text-muted-foreground capitalize">
                        Comparando {format(currentMonthDate, 'MMMM yyyy', { locale: es })} vs {format(previousMonthDate, 'MMMM yyyy', { locale: es })}
                    </p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Gasto Total</CardTitle>
                        <TrendingDown size={16} className={expenseVariation > 0 ? "text-red-500" : "text-green-500"} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(currentExpense)}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            {expenseVariation > 0 ? <ArrowUpRight size={12} className="text-red-500" /> : <ArrowDownRight size={12} className="text-green-500" />}
                            <span className={expenseVariation > 0 ? "text-red-500 font-medium" : "text-green-500 font-medium"}>
                                {Math.abs(expenseVariation).toFixed(1)}%
                            </span>
                            vs mes anterior ({new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(previousExpense)})
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
                        <TrendingUp size={16} className={incomeVariation >= 0 ? "text-green-500" : "text-red-500"} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(currentIncome)}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            {incomeVariation >= 0 ? <ArrowUpRight size={12} className="text-green-500" /> : <ArrowDownRight size={12} className="text-red-500" />}
                            <span className={incomeVariation >= 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                                {Math.abs(incomeVariation).toFixed(1)}%
                            </span>
                            vs mes anterior
                        </p>
                    </CardContent>
                </Card>

                {/* Insight Card: Highest Increase */}
                {(() => {
                    const highestIncrease = [...categoryInsights].sort((a, b) => b.diff - a.diff)[0];
                    if (!highestIncrease || highestIncrease.diff <= 0) return (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Mayor Cambio</CardTitle>
                                <Minus size={16} />
                            </CardHeader>
                            <CardContent className="py-6 text-center text-muted-foreground text-sm">
                                Sin aumentos significativos.
                            </CardContent>
                        </Card>
                    );

                    return (
                        <Card className="bg-destructive/10 border-destructive/20">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-destructive">Mayor Aumento</CardTitle>
                                <TrendingUp size={16} className="text-destructive" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-lg font-bold truncate">{highestIncrease.name}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Gastaste <span className="font-bold text-destructive">+${highestIncrease.diff.toLocaleString('es-MX')}</span> más que el mes pasado.
                                </p>
                            </CardContent>
                        </Card>
                    );
                })()}
            </div>

            {/* Detailed Category Comparison */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart2 size={20} /> Desglose por Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {categoryInsights.map(cat => (
                            <div key={cat.id} className="group">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                        <span className="font-medium text-sm">{cat.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-sm block">${cat.current.toLocaleString('es-MX')}</span>
                                        <span className={`text-xs flex items-center justify-end gap-1 ${cat.diff > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                            {cat.diff > 0 ? '+' : ''}{cat.diff.toLocaleString('es-MX')} ({cat.variation.toFixed(0)}%)
                                        </span>
                                    </div>
                                </div>

                                {/* Comparison Bar */}
                                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                                    {/* Previous Month Marker (Background Bar) */}
                                    {/* We need a scale. Let's use max of current/previous as 100% relative to THIS category max? No, max of ALL categories. */}
                                    {(() => {
                                        const maxVal = Math.max(...categoryInsights.map(c => Math.max(c.current, c.previous)));
                                        const curWidth = (cat.current / maxVal) * 100;
                                        const prevWidth = (cat.previous / maxVal) * 100;

                                        return (
                                            <>
                                                {/* Previous Month (Ghost bar) */}
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-foreground/10 z-10"
                                                    style={{ width: `${prevWidth}%` }}
                                                    title={`Mes Anterior: $${cat.previous}`}
                                                />
                                                {/* Current Month */}
                                                <div
                                                    className="absolute top-0 left-0 h-full z-20 opacity-80"
                                                    style={{
                                                        width: `${curWidth}%`,
                                                        backgroundColor: cat.color
                                                    }}
                                                    title={`Mes Actual: $${cat.current}`}
                                                />
                                            </>
                                        )
                                    })()}
                                </div>
                            </div>
                        ))}
                        {categoryInsights.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No hay datos de gastos para comparar en este periodo.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
>>>>>>> 5514d7732ec911852e1fd69f7bbfd09383699edc
