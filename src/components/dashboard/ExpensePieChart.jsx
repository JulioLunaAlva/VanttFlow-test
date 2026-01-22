<<<<<<< HEAD
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinance } from "@/context/FinanceContext";
import { PieChart as PieChartIcon, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ExpensePieChart = React.memo(() => {
    const { filteredTransactions, categories } = useFinance();
    const [activeIndex, setActiveIndex] = useState(null);

    const data = React.useMemo(() => {
        const expensesByCategory = filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((acc, transaction) => {
                const categoryId = transaction.category;
                if (!acc[categoryId]) {
                    acc[categoryId] = 0;
                }
                acc[categoryId] += Number(transaction.amount);
                return acc;
            }, {});

        return Object.entries(expensesByCategory)
            .map(([categoryId, amount]) => {
                const category = categories.find(c => c.id === categoryId);
                return {
                    name: category?.name || 'Otros',
                    value: amount,
                    color: category?.color || '#94a3b8',
                    categoryId
                };
            })
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);
    }, [filteredTransactions, categories]);

    const total = data.reduce((sum, item) => sum + item.value, 0);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const formatPercent = (value) => {
        return ((value / total) * 100).toFixed(1) + '%';
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-2xl"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: data.payload.color }}
                        />
                        <p className="text-xs font-black uppercase tracking-wider text-foreground/70">
                            {data.name}
                        </p>
                    </div>
                    <p className="text-2xl font-black tracking-tighter" style={{ color: data.payload.color }}>
                        {formatCurrency(data.value)}
                    </p>
                    <p className="text-xs text-foreground/50 mt-1">
                        {formatPercent(data.value)} del total
                    </p>
                </motion.div>
            );
        }
        return null;
    };

    const CustomLegend = ({ payload }) => {
        return (
            <div className="grid grid-cols-2 gap-2 mt-4">
                {payload.map((entry, index) => (
                    <motion.button
                        key={`legend-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                        className={`flex items-center gap-2 p-2 rounded-xl transition-all duration-300 ${activeIndex === null || activeIndex === index
                            ? 'opacity-100 bg-muted/30 hover:bg-muted/50'
                            : 'opacity-40 hover:opacity-70'
                            }`}
                    >
                        <div
                            className="w-3 h-3 rounded-full flex-shrink-0 transition-transform duration-300"
                            style={{
                                backgroundColor: entry.color,
                                transform: activeIndex === index ? 'scale(1.3)' : 'scale(1)'
                            }}
                        />
                        <span className="text-[10px] font-black uppercase tracking-wider text-foreground/70 truncate">
                            {entry.value}
                        </span>
                    </motion.button>
                ))}
            </div>
        );
    };

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    const onPieLeave = () => {
        setActiveIndex(null);
    };

    return (
        <Card className="h-full overflow-hidden border-border/50 bg-gradient-to-br from-card/40 via-card/60 to-card/40 backdrop-blur-xl group transition-all duration-500 hover:shadow-2xl anime:border-2">
            {/* Decorative gradient orbs */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

            <CardHeader className="relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500/20 to-rose-500/10 flex items-center justify-center backdrop-blur-sm border border-rose-500/20">
                        <TrendingDown className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                        <CardTitle className="text-base font-black tracking-tight">Gastos por Categoría</CardTitle>
                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider mt-0.5">
                            Distribución de gastos
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="relative z-10">
                {data.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="h-[300px] flex flex-col items-center justify-center text-center space-y-6 p-8"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-rose-500/10 blur-2xl rounded-full" />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="relative"
                            >
                                <PieChartIcon className="w-16 h-16 text-foreground/20" strokeWidth={1.5} />
                            </motion.div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-black text-foreground/60">Sin gastos registrados</p>
                            <p className="text-xs text-foreground/40 max-w-[200px]">
                                Tus gastos por categoría aparecerán aquí cuando registres transacciones
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {/* Chart Container */}
                        <div className="h-[240px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <defs>
                                        {data.map((entry, index) => (
                                            <linearGradient
                                                key={`gradient-${index}`}
                                                id={`gradient-${index}`}
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                                                <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                                            </linearGradient>
                                        ))}
                                    </defs>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={2}
                                        dataKey="value"
                                        onMouseEnter={onPieEnter}
                                        onMouseLeave={onPieLeave}
                                        animationDuration={800}
                                        animationEasing="ease-out"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={`url(#gradient-${index})`}
                                                stroke="none"
                                                className="transition-all duration-300 hover:opacity-80 outline-none cursor-pointer"
                                                style={{
                                                    filter: activeIndex === index ? 'brightness(1.2)' : 'brightness(1)',
                                                    transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                                                    transformOrigin: 'center'
                                                }}
                                            />
                                        ))}
                                    </Pie>
                                    {/* Tooltip disabled - using center label instead */}
                                </PieChart>
                            </ResponsiveContainer>

                            {/* Center label - COMPLETELY REDESIGNED */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-[120px] h-[120px] flex items-center justify-center">
                                    <AnimatePresence mode="wait">
                                        {activeIndex !== null ? (
                                            <motion.div
                                                key={`selected-${activeIndex}`}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="text-center w-full px-2"
                                            >
                                                <div className="space-y-1">
                                                    <p className="text-[8px] font-bold uppercase tracking-widest text-foreground/40 truncate">
                                                        {data[activeIndex].name}
                                                    </p>
                                                    <p
                                                        className="text-2xl font-black tracking-tighter leading-none"
                                                        style={{ color: data[activeIndex].color }}
                                                    >
                                                        {formatCurrency(data[activeIndex].value)}
                                                    </p>
                                                    <p className="text-[9px] font-semibold text-foreground/50">
                                                        {formatPercent(data[activeIndex].value)}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="total"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="text-center"
                                            >
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-bold uppercase tracking-widest text-foreground/40">
                                                        Total
                                                    </p>
                                                    <p className="text-2xl font-black tracking-tighter text-rose-500 leading-none">
                                                        {formatCurrency(total)}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        <CustomLegend payload={data} />
                    </div>
                )}
            </CardContent>
        </Card>
    );
});
=======
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinance } from "@/context/FinanceContext";
import { PieChart as PieChartIcon, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ExpensePieChart = React.memo(() => {
    const { filteredTransactions, categories } = useFinance();
    const [activeIndex, setActiveIndex] = useState(null);

    const data = React.useMemo(() => {
        const expensesByCategory = filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((acc, transaction) => {
                const categoryId = transaction.category;
                if (!acc[categoryId]) {
                    acc[categoryId] = 0;
                }
                acc[categoryId] += Number(transaction.amount);
                return acc;
            }, {});

        return Object.entries(expensesByCategory)
            .map(([categoryId, amount]) => {
                const category = categories.find(c => c.id === categoryId);
                return {
                    name: category?.name || 'Otros',
                    value: amount,
                    color: category?.color || '#94a3b8',
                    categoryId
                };
            })
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);
    }, [filteredTransactions, categories]);

    const total = data.reduce((sum, item) => sum + item.value, 0);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const formatPercent = (value) => {
        return ((value / total) * 100).toFixed(1) + '%';
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-2xl"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: data.payload.color }}
                        />
                        <p className="text-xs font-black uppercase tracking-wider text-foreground/70">
                            {data.name}
                        </p>
                    </div>
                    <p className="text-2xl font-black tracking-tighter" style={{ color: data.payload.color }}>
                        {formatCurrency(data.value)}
                    </p>
                    <p className="text-xs text-foreground/50 mt-1">
                        {formatPercent(data.value)} del total
                    </p>
                </motion.div>
            );
        }
        return null;
    };

    const CustomLegend = ({ payload }) => {
        return (
            <div className="grid grid-cols-2 gap-2 mt-4">
                {payload.map((entry, index) => (
                    <motion.button
                        key={`legend-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                        className={`flex items-center gap-2 p-2 rounded-xl transition-all duration-300 ${activeIndex === null || activeIndex === index
                            ? 'opacity-100 bg-muted/30 hover:bg-muted/50'
                            : 'opacity-40 hover:opacity-70'
                            }`}
                    >
                        <div
                            className="w-3 h-3 rounded-full flex-shrink-0 transition-transform duration-300"
                            style={{
                                backgroundColor: entry.color,
                                transform: activeIndex === index ? 'scale(1.3)' : 'scale(1)'
                            }}
                        />
                        <span className="text-[10px] font-black uppercase tracking-wider text-foreground/70 truncate">
                            {entry.value}
                        </span>
                    </motion.button>
                ))}
            </div>
        );
    };

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    const onPieLeave = () => {
        setActiveIndex(null);
    };

    return (
        <Card className="h-full overflow-hidden border-border/50 bg-gradient-to-br from-card/40 via-card/60 to-card/40 backdrop-blur-xl group transition-all duration-500 hover:shadow-2xl anime:border-2">
            {/* Decorative gradient orbs */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

            <CardHeader className="relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500/20 to-rose-500/10 flex items-center justify-center backdrop-blur-sm border border-rose-500/20">
                        <TrendingDown className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                        <CardTitle className="text-base font-black tracking-tight">Gastos por Categoría</CardTitle>
                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider mt-0.5">
                            Distribución de gastos
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="relative z-10">
                {data.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="h-[300px] flex flex-col items-center justify-center text-center space-y-6 p-8"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-rose-500/10 blur-2xl rounded-full" />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="relative"
                            >
                                <PieChartIcon className="w-16 h-16 text-foreground/20" strokeWidth={1.5} />
                            </motion.div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-black text-foreground/60">Sin gastos registrados</p>
                            <p className="text-xs text-foreground/40 max-w-[200px]">
                                Tus gastos por categoría aparecerán aquí cuando registres transacciones
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {/* Chart Container */}
                        <div className="h-[240px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <defs>
                                        {data.map((entry, index) => (
                                            <linearGradient
                                                key={`gradient-${index}`}
                                                id={`gradient-${index}`}
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                                                <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                                            </linearGradient>
                                        ))}
                                    </defs>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={2}
                                        dataKey="value"
                                        onMouseEnter={onPieEnter}
                                        onMouseLeave={onPieLeave}
                                        animationDuration={800}
                                        animationEasing="ease-out"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={`url(#gradient-${index})`}
                                                stroke="none"
                                                className="transition-all duration-300 hover:opacity-80 outline-none cursor-pointer"
                                                style={{
                                                    filter: activeIndex === index ? 'brightness(1.2)' : 'brightness(1)',
                                                    transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                                                    transformOrigin: 'center'
                                                }}
                                            />
                                        ))}
                                    </Pie>
                                    {/* Tooltip disabled - using center label instead */}
                                </PieChart>
                            </ResponsiveContainer>

                            {/* Center label - COMPLETELY REDESIGNED */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-[120px] h-[120px] flex items-center justify-center">
                                    <AnimatePresence mode="wait">
                                        {activeIndex !== null ? (
                                            <motion.div
                                                key={`selected-${activeIndex}`}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="text-center w-full px-2"
                                            >
                                                <div className="space-y-1">
                                                    <p className="text-[8px] font-bold uppercase tracking-widest text-foreground/40 truncate">
                                                        {data[activeIndex].name}
                                                    </p>
                                                    <p
                                                        className="text-2xl font-black tracking-tighter leading-none"
                                                        style={{ color: data[activeIndex].color }}
                                                    >
                                                        {formatCurrency(data[activeIndex].value)}
                                                    </p>
                                                    <p className="text-[9px] font-semibold text-foreground/50">
                                                        {formatPercent(data[activeIndex].value)}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="total"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="text-center"
                                            >
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-bold uppercase tracking-widest text-foreground/40">
                                                        Total
                                                    </p>
                                                    <p className="text-2xl font-black tracking-tighter text-rose-500 leading-none">
                                                        {formatCurrency(total)}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        <CustomLegend payload={data} />
                    </div>
                )}
            </CardContent>
        </Card>
    );
});
>>>>>>> 5514d7732ec911852e1fd69f7bbfd09383699edc
