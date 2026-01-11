import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from "@/context/FinanceContext";

export const BalanceBarChart = () => {
    const { getSummary } = useFinance();
    const { income, expense } = getSummary();

    const data = [
        {
            name: 'Total',
            Ingresos: income,
            Gastos: expense,
        },
    ];

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Resumen General</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center">
                    {income === 0 && expense === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                            <div className="flex items-end gap-1 mb-2">
                                <div className="w-4 h-8 bg-slate-200 dark:bg-slate-800 rounded-t-sm" />
                                <div className="w-4 h-16 bg-slate-300 dark:bg-slate-700 rounded-t-sm" />
                                <div className="w-4 h-12 bg-slate-200 dark:bg-slate-800 rounded-t-sm" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Sin datos de balance</p>
                                <p className="text-xs text-muted-foreground">Tu comparativa de ingresos vs gastos aparecerá aquí.</p>
                            </div>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    formatter={(value) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)}
                                />
                                <Bar dataKey="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Gastos" fill="#f87171" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
