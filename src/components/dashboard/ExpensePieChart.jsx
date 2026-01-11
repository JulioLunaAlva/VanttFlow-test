import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useFinance } from "@/context/FinanceContext";

export const ExpensePieChart = () => {
    const { filteredTransactions, categories } = useFinance();

    const data = React.useMemo(() => {
        const expenses = filteredTransactions.filter(t => t.type === 'expense');
        const categoryTotals = {};

        expenses.forEach(t => {
            const catId = t.category || 'other_expense';
            categoryTotals[catId] = (categoryTotals[catId] || 0) + Number(t.amount);
        });

        return Object.entries(categoryTotals).map(([catId, value]) => {
            const categoryInfo = categories.find(c => c.id === catId) ||
                { name: 'Otros', color: '#cbd5e1' };
            return {
                name: categoryInfo.name,
                value: value,
                color: categoryInfo.color
            };
        }).sort((a, b) => b.value - a.value);
    }, [filteredTransactions]);

    if (data.length === 0) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Gastos por Categoría</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                    <div className="w-16 h-16 border-4 border-dashed border-slate-300 dark:border-slate-700 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-full" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium">Distribución no disponible</p>
                        <p className="text-xs text-muted-foreground">Registra gastos para ver el gráfico de categorías.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle>Gastos por Categoría</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
