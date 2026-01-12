import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useFinance } from "@/context/FinanceContext";
import { PieChart as PieChartIcon } from 'lucide-react';

export const ExpensePieChart = React.memo(() => {
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
            <Card className="h-full overflow-hidden border-border/50 bg-card/40 backdrop-blur-xl group transition-all duration-500 anime:border-2">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-primary/80 anime:text-foreground">Gastos por Categoría</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex flex-col items-center justify-center text-center p-6 mt-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="w-16 h-16 rounded-full bg-muted/40 flex items-center justify-center mb-4 border-2 border-dashed border-border/60 animate-pulse">
                        <PieChartIcon className="text-foreground/20" size={32} />
                    </div>
                    <div className="space-y-1 relative z-10">
                        <p className="text-sm font-black uppercase tracking-tight text-foreground">Distribución no disponible</p>
                        <p className="text-[10px] text-foreground/60 font-medium max-w-[200px] leading-relaxed">Registra tus primeros gastos para visualizar cómo se divide tu dinero.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full flex flex-col overflow-hidden border-border/50 bg-card/40 backdrop-blur-xl group transition-all duration-500 hover:shadow-lg anime:border-2">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-primary/80 anime:text-foreground">Gastos por Categoría</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={85}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    className="transition-all duration-500 hover:opacity-80 outline-none"
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border) / 0.5)',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '900',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}
                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                            formatter={(value) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={40}
                            iconType="circle"
                            formatter={(value) => (
                                <span className="text-[10px] font-black uppercase tracking-wider text-foreground/70 anime:text-foreground">
                                    {value}
                                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
});
