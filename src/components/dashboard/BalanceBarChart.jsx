import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useFinance } from "@/context/FinanceContext";
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIdentity } from "@/context/IdentityContext";
import { useTranslation } from 'react-i18next';
import { cn } from "@/lib/utils";

export const BalanceBarChart = React.memo(() => {
    const { t } = useTranslation();
    const { summary } = useFinance();
    const { user } = useIdentity();
    const currency = user?.currency || 'MXN';
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
            currency: currency,
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
        <div className="h-full flex flex-col relative group overflow-hidden">
            {/* Background mystical glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] group-hover:bg-primary/20 transition-all duration-700" />
            
            <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-primary/10 text-primary shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <BarChart3 size={20} />
                    </span>
                    <div>
                        <h3 className="text-xl font-black tracking-tight leading-none">{t('dashboard.balance_chart.title') || 'Resumen General'}</h3>
                        <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest mt-1">
                            {t('dashboard.balance_chart.subtitle') || 'Balance del período'}
                        </p>
                    </div>
                </div>
                {income > 0 && expense > 0 && (
                    <div className="text-right">
                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">{t('dashboard.balance_chart.difference') || 'Diferencia'}</p>
                        <p className={cn(
                            "text-xl font-black tracking-tighter drop-shadow-sm",
                            income > expense ? 'text-emerald-500' : 'text-rose-500'
                        )}>
                            {formatCurrency(income - expense)}
                        </p>
                    </div>
                )}
            </div>
            
            <div className="p-6 flex-1 flex flex-col relative z-10">
                <div className="flex-1 w-full flex items-center justify-center min-h-[280px]">
                    {income === 0 && expense === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center text-center space-y-6"
                        >
                            <div className="relative group/empty">
                                <div className="absolute inset-0 bg-primary/5 blur-[40px] rounded-full group-hover/empty:bg-primary/10 transition-all duration-700" />
                                <div className="relative flex items-end gap-3 p-6 bg-white/5 rounded-[2rem] border border-white/10">
                                    <motion.div
                                        animate={{ height: [20, 32, 20] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-4 bg-primary/20 rounded-full"
                                    />
                                    <motion.div
                                        animate={{ height: [32, 48, 32] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                                        className="w-4 bg-primary/40 rounded-full"
                                    />
                                    <motion.div
                                        animate={{ height: [20, 40, 20] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                                        className="w-4 bg-primary/20 rounded-full"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-black uppercase tracking-tight opacity-60">{t('dashboard.balance_chart.no_data') || 'Sin datos de balance'}</p>
                                <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest max-w-[200px] leading-relaxed">
                                    {t('dashboard.balance_chart.no_data_desc') || 'Registra tus primeras transacciones para ver tu comparativa aquí'}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 10,
                                    bottom: 10,
                                }}
                                barGap={24}
                            >
                                <defs>
                                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
                                    </linearGradient>
                                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f43f5e" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.6} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="rgba(255,255,255,0.05)"
                                />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: 'rgba(255,255,255,0.4)',
                                        fontSize: 10,
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em'
                                    }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: 'rgba(255,255,255,0.2)',
                                        fontSize: 9,
                                        fontWeight: 800
                                    }}
                                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 16 }}
                                />
                                <Bar
                                    dataKey="value"
                                    radius={[16, 16, 0, 0]}
                                    maxBarSize={60}
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.gradient}
                                            className="transition-all duration-500 outline-none cursor-pointer hover:opacity-80"
                                            style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.05))' }}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
        </div>
    );
});
