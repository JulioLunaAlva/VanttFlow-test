import React from 'react';
import { useFinance } from "@/context/FinanceContext";
import { useIdentity } from "@/context/IdentityContext";
import { useGamification } from "@/context/GamificationContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Minus, BarChart2, LineChart as LineChartIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subMonths, isSameMonth } from 'date-fns';
import { es, enUS, ptBR, fr } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { cn, parseLocalDateStr } from "@/lib/utils";

export const AnalyticsPage = () => {
    const { t, i18n } = useTranslation();
    const { transactions, selectedMonth, categories, netWorthHistory } = useFinance();
    const { user } = useIdentity();
    const currency = user?.currency || 'MXN';
    const { completeMission } = useGamification();

    const localeMap = { es, en: enUS, pt: ptBR, fr };
    const currentLocale = localeMap[i18n.language] || es;

    // Sort history by date to ensure correct chart rendering
    const chartData = [...netWorthHistory].sort((a, b) => parseLocalDateStr(a.date) - parseLocalDateStr(b.date));


    React.useEffect(() => {
        completeMission('visit_analytics');
    }, []);

    // 1. Determine comparison months
    const currentMonthDate = selectedMonth;
    const previousMonthDate = subMonths(selectedMonth, 1);

    // 2. Filter Data
    const getMonthData = (date) => {
        return transactions.filter(t => isSameMonth(parseLocalDateStr(t.date), date));
    };

    const currentData = getMonthData(currentMonthDate);
    const previousData = getMonthData(previousMonthDate);

    // 3. Calculate Totals
    const calculateTotal = (data, type) => data.filter(t => t.type === type && !t.isInstallmentTotal).reduce((acc, curr) => acc + Number(curr.amount), 0);

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
        <div className="space-y-6 pb-32 md:pb-8 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
            {/* Header Compacto */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between card-elevated px-5 py-4 md:px-8 md:py-6 rounded-3xl mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-primary/10 border border-primary/20 text-primary">
                        <BarChart2 size={20} />
                    </div>
                    <div>
                        <h2 className="text-title font-black text-foreground">{t('analytics.title')}</h2>
                        <p className="text-caption text-muted-foreground/50 mt-0.5">Análisis financiero avanzado</p>
                    </div>
                </div>
            </div>



            {/* Patrimony Evolution Chart */}
            <div className="card-base mb-8 overflow-hidden">
                <div className="px-6 py-5 border-b border-border/50 bg-card/50 flex items-center justify-between">
                    <div>
                        <h3 className="flex items-center gap-2 text-lg font-black tracking-tight text-foreground">
                            <div className="p-1.5 bg-primary/10 rounded-lg"><TrendingUp size={18} className="text-primary" /></div>
                            {t('analytics.patrimony_evolution')}
                        </h3>
                    </div>
                </div>
                <div className="p-6 h-[350px] w-full bg-card">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(val) => format(parseLocalDateStr(val), 'dd MMM', { locale: currentLocale })}
                                    stroke="rgba(255,255,255,0.2)"
                                    fontSize={10}
                                    fontWeight="bold"
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    stroke="rgba(255,255,255,0.2)"
                                    fontSize={10}
                                    fontWeight="bold"
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    contentStyle={{ 
                                        borderRadius: '24px', 
                                        background: 'rgba(0,0,0,0.8)', 
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(255,255,255,0.1)', 
                                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                                        padding: '16px 24px'
                                    }}
                                    itemStyle={{ color: '#10b981', fontWeight: '900', fontSize: '14px', letterSpacing: '-0.02em' }}
                                    labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px', fontWeight: '900' }}
                                    formatter={(value) => [new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency }).format(value), t('analytics.patrimony')]}
                                    labelFormatter={(label) => format(parseLocalDateStr(label), 'dd MMMM yyyy', { locale: currentLocale })}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="balance"
                                    stroke="#10b981"
                                    fillOpacity={1}
                                    fill="url(#colorBalance)"
                                    strokeWidth={4}
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30">
                            <LineChartIcon size={64} className="mb-6 opacity-20" />
                            <p className="font-black uppercase tracking-[0.3em] text-sm">{t('analytics.empty_history')}</p>
                            <p className="text-[10px] font-bold mt-2 uppercase tracking-[0.1em] opacity-40">{t('analytics.empty_history_sub')}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Income vs Expenses Legend */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 card-base overflow-hidden">
                    <div className="px-6 py-5 border-b border-border/50 bg-card/50">
                        <h3 className="flex items-center gap-2 text-lg font-black tracking-tight text-foreground">
                            <div className="p-1.5 bg-primary/10 rounded-lg"><BarChart2 size={18} className="text-primary" /></div>
                            {t('analytics.cash_flow_title') || 'Flujo de Caja Histórico'}
                        </h3>
                    </div>
                    <div className="p-6 h-[350px] bg-card">
                        {(() => {
                            const last6Months = Array.from({ length: 6 }).map((_, i) => subMonths(new Date(), i)).reverse();
                            const flowData = last6Months.map(monthDate => {
                                const mData = transactions.filter(t => isSameMonth(parseLocalDateStr(t.date), monthDate));
                                return {
                                    name: format(monthDate, 'MMM', { locale: currentLocale }),
                                    income: calculateTotal(mData, 'income'),
                                    expense: calculateTotal(mData, 'expense')
                                };
                            });

                            return (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={flowData}>
                                        <defs>
                                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="name" fontSize={10} fontWeight="900" stroke="rgba(255,255,255,0.2)" axisLine={false} tickLine={false} />
                                        <YAxis fontSize={10} fontWeight="900" stroke="rgba(255,255,255,0.2)" axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                                        <Tooltip
                                            contentStyle={{ 
                                                borderRadius: '24px', 
                                                background: 'rgba(0,0,0,0.8)', 
                                                backdropFilter: 'blur(12px)',
                                                border: '1px solid rgba(255,255,255,0.1)', 
                                                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                                                padding: '16px 24px'
                                            }}
                                            itemStyle={{ fontWeight: '900', fontSize: '14px' }}
                                            labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px', fontWeight: '900' }}
                                            formatter={(v) => new Intl.NumberFormat(i18n.language, { style: 'currency', currency }).format(v)}
                                        />
                                        <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} />
                                        <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            );
                        })()}
                    </div>
                </div>

                {/* Savings Insight card - alongside chart */}
                <div className="card-base flex flex-col relative overflow-hidden">
                    <div className="px-6 py-5 border-b border-border/50 bg-card/50 text-center">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('analytics.savings_summary') || 'Resumen de Ahorro'}</h3>
                    </div>
                    <div className="p-8 flex-1 flex flex-col items-center justify-center space-y-8 relative z-10 bg-card">
                        <div className="text-center group/savings">
                            <p className="text-[10px] text-primary uppercase tracking-widest font-bold mb-2 transition-all">{t('analytics.net_savings') || 'Ahorro Neto (Este Mes)'}</p>
                            <p className={cn(
                                "text-3xl font-black tracking-tight",
                                currentIncome - currentExpense >= 0 ? "text-emerald-500" : "text-rose-500"
                            )}>
                                {new Intl.NumberFormat(i18n.language, { style: 'currency', currency }).format(currentIncome - currentExpense)}
                            </p>
                        </div>
                        
                        <div className="w-full space-y-4">
                            <div className="w-full h-4 bg-foreground/5 rounded-full overflow-hidden flex shadow-inner border border-border/30 p-1">
                                {currentIncome > 0 && (
                                    <>
                                        <div
                                            className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                                            style={{ width: `${Math.min(100, (currentExpense / currentIncome) * 100)}%` }}
                                        />
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-glow ml-1"
                                            style={{ width: `${Math.max(0, 100 - (currentExpense / currentIncome) * 100)}%` }}
                                        />
                                    </>
                                )}
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">
                                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500" /> Gasto</span>
                                <span className="flex items-center gap-2">Ahorro <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-glow" /></span>
                            </div>
                        </div>

                        <p className="text-[11px] text-center text-foreground/40 font-black uppercase tracking-[0.3em] bg-foreground/5 p-4 rounded-2xl w-full border border-border/30">
                            {currentIncome > 0
                                ? `${((currentExpense / currentIncome) * 100).toFixed(1)}% ${t('analytics.of_income_spent') || 'de tus ingresos han sido gastados'}`
                                : t('analytics.no_income_data') || 'Sin datos de ingresos para este mes'
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                <div className="card-base p-6 md:p-8">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('analytics.total_expense')}</p>
                        <div className={cn(
                            "p-2 rounded-xl border",
                            expenseVariation > 0 ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                        )}>
                            <TrendingDown size={18} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl md:text-3xl font-black tracking-tight text-foreground">{new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency }).format(currentExpense)}</div>
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] mt-6 flex items-center gap-2">
                            <span className={cn(
                                "flex items-center gap-1 p-1 px-3 rounded-full border",
                                expenseVariation > 0 ? "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-glow" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            )}>
                                {expenseVariation > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {Math.abs(expenseVariation).toFixed(1)}%
                            </span>
                            <span className="text-foreground/20 ml-2">{t('analytics.vs_previous_short')}</span>
                        </p>
                    </div>
                </div>

                <div className="card-base p-6 md:p-8">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('analytics.income')}</p>
                        <div className={cn(
                            "p-2 rounded-xl border",
                            incomeVariation >= 0 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                        )}>
                            <TrendingUp size={18} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl md:text-3xl font-black tracking-tight text-foreground">{new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency }).format(currentIncome)}</div>
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] mt-6 flex items-center gap-2">
                            <span className={cn(
                                "flex items-center gap-1 p-1 px-3 rounded-full border",
                                incomeVariation >= 0 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-glow" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                            )}>
                                {incomeVariation >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {Math.abs(incomeVariation).toFixed(1)}%
                            </span>
                            <span className="text-foreground/20 ml-2">{t('analytics.vs_previous_short')}</span>
                        </p>
                    </div>
                </div>

                {/* Insight Card: Highest Increase */}
                {(() => {
                    const highestIncrease = [...categoryInsights].sort((a, b) => b.diff - a.diff)[0];
                    if (!highestIncrease || highestIncrease.diff <= 0) return (
                        <div className="card-base p-6 md:p-8 flex items-center justify-center">
                            <div className="text-center text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                                <Minus size={24} className="mx-auto mb-3 opacity-20" />
                                {t('analytics.no_significant_changes')}
                            </div>
                        </div>
                    );

                    return (
                        <div className="card-base p-6 md:p-8 bg-rose-500/5 border-rose-500/20">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-4">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-rose-500">{t('analytics.biggest_increase')}</h4>
                                <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500">
                                    <TrendingUp size={18} />
                                </div>
                            </div>
                            <div className="space-y-4 relative z-10">
                                <div className="text-4xl font-black tracking-tighter text-foreground drop-shadow-2xl leading-none">{highestIncrease.name}</div>
                                <p className="text-[11px] text-foreground/40 font-black uppercase tracking-[0.3em] mt-6 bg-black/20 p-4 rounded-2xl border border-border/30">
                                    {t('analytics.increase_desc', {
                                        amount: new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency }).format(highestIncrease.diff)
                                    })}
                                </p>
                            </div>
                        </div>
                    );
                })()}
            </div>

            {/* Detailed Category Comparison */}
            <div className="card-base mb-8 overflow-hidden">
                <div className="px-6 py-5 border-b border-border/50 bg-card/50 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-black tracking-tight text-foreground">
                        <div className="p-1.5 bg-primary/10 rounded-lg text-primary"><BarChart2 size={18} /></div>
                        {t('analytics.category_breakdown')}
                    </h3>
                </div>
                <div className="p-6 md:p-8 bg-card">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {categoryInsights.map(cat => (
                            <div key={cat.id} className="group/item">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border border-border/30" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                                            <TrendingUp size={16} />
                                        </div>
                                        <div className="min-w-0 flex-1 pr-2">
                                            <span className="font-bold text-base tracking-tight text-foreground block truncate">{cat.name}</span>
                                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5 block truncate">{t('analytics.monthly_spend')}</span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-4">
                                        <span className="font-black text-2xl tracking-tighter text-foreground block drop-shadow-2xl">{new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency }).format(cat.current)}</span>
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-end gap-2 mt-1",
                                            cat.diff > 0 ? 'text-rose-500' : 'text-emerald-500'
                                        )}>
                                            {cat.diff > 0 ? <ArrowUpRight size={12} className="shadow-glow" /> : <ArrowDownRight size={12} />}
                                            {cat.diff > 0 ? '+' : ''}{new Intl.NumberFormat(i18n.language, { style: 'currency', currency: currency }).format(cat.diff)}
                                        </span>
                                    </div>
                                </div>

                                <div className="relative h-3 bg-foreground/5 rounded-full overflow-hidden p-0.5 border border-border/30">
                                    {(() => {
                                        const maxVal = Math.max(...categoryInsights.map(c => Math.max(c.current, c.previous)));
                                        const curWidth = (cat.current / maxVal) * 100;
                                        const prevWidth = (cat.previous / maxVal) * 100;

                                        return (
                                            <>
                                                <div
                                                    className="absolute top-0.5 left-0.5 h-[calc(100%-4px)] bg-foreground/10 rounded-full z-10 transition-all duration-1500"
                                                    style={{ width: `${prevWidth}%` }}
                                                />
                                                <div
                                                    className="absolute top-0.5 left-0.5 h-[calc(100%-4px)] rounded-full z-20 transition-all duration-1500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-glow"
                                                    style={{
                                                        width: `${curWidth}%`,
                                                        backgroundColor: cat.color,
                                                        boxShadow: `0 0 20px ${cat.color}40`
                                                    }}
                                                />
                                            </>
                                        )
                                    })()}
                                </div>
                            </div>
                        ))}
                    </div>
                    {categoryInsights.length === 0 && (
                        <div className="text-center py-32 bg-foreground/5 rounded-[4rem] border-2 border-dashed border-border/30 mt-8">
                            <BarChart2 size={64} className="mx-auto mb-8 opacity-10" />
                            <p className="text-foreground/20 font-black uppercase tracking-[0.5em] text-xs">{t('analytics.no_data')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
