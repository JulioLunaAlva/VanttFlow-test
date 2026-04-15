import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinance } from "@/context/FinanceContext";
import { PieChart as PieChartIcon, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIdentity } from "@/context/IdentityContext";
import { useTranslation } from 'react-i18next';
import { cn } from "@/lib/utils";
export const ExpensePieChart = React.memo(() => {
    const { filteredTransactions, categories } = useFinance();
    const { user } = useIdentity();
    const { t } = useTranslation();
    const currency = user?.currency || 'MXN';
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
            currency: currency,
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
                        {formatPercent(data.value)} {t('dashboard.pie_chart.of_total')}
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
        <div className="h-full flex flex-col relative group overflow-hidden">
            {/* Background mystical glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-[60px] group-hover:bg-rose-500/20 transition-all duration-700" />
            
            <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-rose-500/10 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                        <TrendingDown size={20} />
                    </span>
                    <div>
                        <h3 className="text-xl font-black tracking-tight leading-none">{t('dashboard.pie_chart.title')}</h3>
                        <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest mt-1">
                            {t('dashboard.pie_chart.subtitle')}
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col relative z-10">
                {data.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
                    >
                        <div className="relative group/empty">
                            <div className="absolute inset-0 bg-rose-500/5 blur-[40px] rounded-full group-hover/empty:bg-rose-500/10 transition-all duration-700" />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                className="relative p-6 bg-white/5 rounded-full border border-white/10"
                            >
                                <PieChartIcon className="w-12 h-12 text-muted-foreground/20" strokeWidth={1.5} />
                            </motion.div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-black uppercase tracking-tight opacity-60">{t('dashboard.pie_chart.no_data')}</p>
                            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest max-w-[200px] leading-relaxed">
                                {t('dashboard.pie_chart.no_data_desc')}
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex-1 flex flex-col">
                        {/* Chart Container */}
                        <div className="flex-1 min-h-[220px] w-full relative group/chart">
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
                                        innerRadius={70}
                                        outerRadius={95}
                                        paddingAngle={4}
                                        dataKey="value"
                                        onMouseEnter={onPieEnter}
                                        onMouseLeave={onPieLeave}
                                        animationDuration={1000}
                                        animationEasing="ease-in-out"
                                        stroke="none"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={`url(#gradient-${index})`}
                                                className="transition-all duration-500 outline-none cursor-pointer drop-shadow-[0_0_8px_rgba(255,255,255,0.05)]"
                                                style={{
                                                    filter: activeIndex === index ? 'brightness(1.1) saturate(1.2)' : 'brightness(0.9) saturate(0.8)',
                                                    opacity: activeIndex !== null && activeIndex !== index ? 0.3 : 1,
                                                }}
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            
                            {/* Center label */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="p-4 rounded-full glass-premium border border-white/5 w-32 h-32 flex items-center justify-center shadow-2xl">
                                    <AnimatePresence mode="wait">
                                        {activeIndex !== null ? (
                                            <motion.div
                                                key={`selected-${activeIndex}`}
                                                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                className="text-center"
                                            >
                                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 truncate max-w-[80px]">
                                                    {data[activeIndex]?.name}
                                                </p>
                                                <p
                                                    className="text-xl font-black tracking-tighter leading-none my-1"
                                                    style={{ color: data[activeIndex]?.color }}
                                                >
                                                    {formatCurrency(data[activeIndex]?.value)}
                                                </p>
                                                <p className="text-[10px] font-black tracking-[0.1em] opacity-40">
                                                    {formatPercent(data[activeIndex]?.value)}
                                                </p>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="total"
                                                initial={{ opacity: 0, scale: 1.1 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 1.1 }}
                                                className="text-center"
                                            >
                                                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-1">
                                                    {t('dashboard.pie_chart.total_label')}
                                                </p>
                                                <p className="text-2xl font-black tracking-tighter text-rose-500 leading-none drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                                                    {formatCurrency(total)}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                        
                        {/* Custom Legend */}
                        <div className="grid grid-cols-2 gap-3 mt-6">
                            {data.map((entry, index) => (
                                <motion.button
                                    key={`legend-${index}`}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                    className={cn(
                                        "flex items-center gap-3 p-2.5 rounded-2xl border transition-all duration-300",
                                        activeIndex === index 
                                            ? "bg-white/10 border-white/20 shadow-lg scale-[1.02]" 
                                            : "bg-white/5 border-white/5 hover:border-white/10 opacity-70 hover:opacity-100"
                                    )}
                                >
                                    <div
                                        className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-transform duration-500"
                                        style={{ 
                                            backgroundColor: entry.color,
                                            boxShadow: activeIndex === index ? `0 0 15px ${entry.color}40` : 'none',
                                            transform: activeIndex === index ? 'scale(1.2)' : 'scale(1)'
                                        }}
                                    />
                                    <div className="flex-1 min-w-0 text-left">
                                        <p className="text-[10px] font-black uppercase tracking-wider text-foreground/80 truncate">
                                            {entry.name}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-[9px] font-bold opacity-40">{formatPercent(entry.value)}</p>
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Background elements */}
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-rose-500/5 rounded-full blur-[100px]" />
        </div>
    );
});