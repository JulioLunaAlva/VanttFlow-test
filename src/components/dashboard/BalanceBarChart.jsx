<<<<<<< HEAD
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useFinance } from "@/context/FinanceContext";
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export const BalanceBarChart = () => {
    const { summary } = useFinance();
    const { income, expense } = summary;

    const data = [
        {
            name: 'Ingresos',
            value: income,
            color: '#10b981',
            gradient: 'url(#incomeGradient)',
            icon: TrendingUp
        },
        {
            name: 'Gastos',
            value: expense,
            color: '#f87171',
            gradient: 'url(#expenseGradient)',
            icon: TrendingDown
        },
    ];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const Icon = data.icon;
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-2xl"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${data.name === 'Ingresos' ? 'bg-emerald-500/10' : 'bg-rose-500/10'
                            }`}>
                            <Icon className={`w-4 h-4 ${data.name === 'Ingresos' ? 'text-emerald-500' : 'text-rose-500'
                                }`} />
                        </div>
                        <p className="text-xs font-black uppercase tracking-wider text-foreground/70">{data.name}</p>
                    </div>
                    <p className="text-2xl font-black tracking-tighter" style={{ color: data.color }}>
                        {formatCurrency(data.value)}
                    </p>
                </motion.div>
            );
        }
        return null;
    };

    return (
        <Card className="h-full overflow-hidden border-border/50 bg-gradient-to-br from-card/40 via-card/60 to-card/40 backdrop-blur-xl group transition-all duration-500 hover:shadow-2xl anime:border-2">
            {/* Decorative gradient orbs */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center backdrop-blur-sm border border-primary/20">
                            <BarChart3 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-base font-black tracking-tight">Resumen General</CardTitle>
                            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider mt-0.5">
                                Balance del período
                            </p>
                        </div>
                    </div>
                    {income > 0 && expense > 0 && (
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-wider text-foreground/50">Diferencia</p>
                            <p className={`text-lg font-black tracking-tighter ${income > expense ? 'text-emerald-500' : 'text-rose-500'
                                }`}>
                                {formatCurrency(income - expense)}
                            </p>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="h-[280px] w-full flex items-center justify-center">
                    {income === 0 && expense === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center text-center space-y-6 p-8"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
                                <div className="relative flex items-end gap-2 mb-2">
                                    <motion.div
                                        animate={{ height: [20, 32, 20] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-6 bg-gradient-to-t from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-t-lg"
                                    />
                                    <motion.div
                                        animate={{ height: [32, 48, 32] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                                        className="w-6 bg-gradient-to-t from-slate-400 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-t-lg"
                                    />
                                    <motion.div
                                        animate={{ height: [20, 40, 20] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                                        className="w-6 bg-gradient-to-t from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-t-lg"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-black text-foreground/60">Sin datos de balance</p>
                                <p className="text-xs text-foreground/40 max-w-[200px]">
                                    Registra tus primeras transacciones para ver tu comparativa aquí
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    left: 20,
                                    bottom: 20,
                                }}
                                barGap={20}
                            >
                                <defs>
                                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                                    </linearGradient>
                                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f87171" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="hsl(var(--border))"
                                    opacity={0.3}
                                />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: 'hsl(var(--foreground))',
                                        fontSize: 11,
                                        fontWeight: 700
                                    }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: 'hsl(var(--foreground))',
                                        fontSize: 10,
                                        fontWeight: 600,
                                        opacity: 0.5
                                    }}
                                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{ fill: 'hsl(var(--primary))', opacity: 0.05, radius: 8 }}
                                />
                                <Bar
                                    dataKey="value"
                                    radius={[12, 12, 0, 0]}
                                    maxBarSize={80}
                                    animationDuration={800}
                                    animationEasing="ease-out"
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.gradient}
                                            className="transition-all duration-300 hover:opacity-80"
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
=======
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useFinance } from "@/context/FinanceContext";
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export const BalanceBarChart = () => {
    const { summary } = useFinance();
    const { income, expense } = summary;

    const data = [
        {
            name: 'Ingresos',
            value: income,
            color: '#10b981',
            gradient: 'url(#incomeGradient)',
            icon: TrendingUp
        },
        {
            name: 'Gastos',
            value: expense,
            color: '#f87171',
            gradient: 'url(#expenseGradient)',
            icon: TrendingDown
        },
    ];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const Icon = data.icon;
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-2xl"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${data.name === 'Ingresos' ? 'bg-emerald-500/10' : 'bg-rose-500/10'
                            }`}>
                            <Icon className={`w-4 h-4 ${data.name === 'Ingresos' ? 'text-emerald-500' : 'text-rose-500'
                                }`} />
                        </div>
                        <p className="text-xs font-black uppercase tracking-wider text-foreground/70">{data.name}</p>
                    </div>
                    <p className="text-2xl font-black tracking-tighter" style={{ color: data.color }}>
                        {formatCurrency(data.value)}
                    </p>
                </motion.div>
            );
        }
        return null;
    };

    return (
        <Card className="h-full overflow-hidden border-border/50 bg-gradient-to-br from-card/40 via-card/60 to-card/40 backdrop-blur-xl group transition-all duration-500 hover:shadow-2xl anime:border-2">
            {/* Decorative gradient orbs */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center backdrop-blur-sm border border-primary/20">
                            <BarChart3 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-base font-black tracking-tight">Resumen General</CardTitle>
                            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider mt-0.5">
                                Balance del período
                            </p>
                        </div>
                    </div>
                    {income > 0 && expense > 0 && (
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-wider text-foreground/50">Diferencia</p>
                            <p className={`text-lg font-black tracking-tighter ${income > expense ? 'text-emerald-500' : 'text-rose-500'
                                }`}>
                                {formatCurrency(income - expense)}
                            </p>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="h-[280px] w-full flex items-center justify-center">
                    {income === 0 && expense === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center text-center space-y-6 p-8"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
                                <div className="relative flex items-end gap-2 mb-2">
                                    <motion.div
                                        animate={{ height: [20, 32, 20] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-6 bg-gradient-to-t from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-t-lg"
                                    />
                                    <motion.div
                                        animate={{ height: [32, 48, 32] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                                        className="w-6 bg-gradient-to-t from-slate-400 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-t-lg"
                                    />
                                    <motion.div
                                        animate={{ height: [20, 40, 20] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                                        className="w-6 bg-gradient-to-t from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-t-lg"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-black text-foreground/60">Sin datos de balance</p>
                                <p className="text-xs text-foreground/40 max-w-[200px]">
                                    Registra tus primeras transacciones para ver tu comparativa aquí
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    left: 20,
                                    bottom: 20,
                                }}
                                barGap={20}
                            >
                                <defs>
                                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                                    </linearGradient>
                                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f87171" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="hsl(var(--border))"
                                    opacity={0.3}
                                />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: 'hsl(var(--foreground))',
                                        fontSize: 11,
                                        fontWeight: 700
                                    }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: 'hsl(var(--foreground))',
                                        fontSize: 10,
                                        fontWeight: 600,
                                        opacity: 0.5
                                    }}
                                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{ fill: 'hsl(var(--primary))', opacity: 0.05, radius: 8 }}
                                />
                                <Bar
                                    dataKey="value"
                                    radius={[12, 12, 0, 0]}
                                    maxBarSize={80}
                                    animationDuration={800}
                                    animationEasing="ease-out"
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.gradient}
                                            className="transition-all duration-300 hover:opacity-80"
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
>>>>>>> 5514d7732ec911852e1fd69f7bbfd09383699edc
