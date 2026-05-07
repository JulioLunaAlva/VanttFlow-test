import React, { useMemo } from 'react';
import { useMarket } from '@/context/MarketContext';
import { MarketInsights } from '@/components/dashboard/MarketInsights';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Coins,
    Gem,
    RefreshCcw,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    ArrowRight,
    Zap,
    Sparkles
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';

// Mock data for graphs (since real-time series requires more API calls or paid tiers)
const generateChartData = (base, volatility, days = 7) => {
    return Array.from({ length: days }).map((_, i) => {
        const change = (Math.random() - 0.45) * volatility;
        return {
            name: `Ene ${11 - (6 - i)}`,
            value: base * (1 + change * i)
        };
    });
};

export const MarketPage = () => {
    const { marketData, refresh, loading } = useMarket();

    const charts = useMemo(() => ({
        usd: generateChartData(marketData.usdMxn.price, 0.005),
        btc: generateChartData(marketData.btcUsd.price, 0.03),
        eth: generateChartData(marketData.ethUsd.price, 0.04)
    }), [marketData]);

    const stats = [
        {
            title: "Dólar Americano",
            subtitle: "USD/MXN",
            value: marketData.usdMxn.price.toFixed(2),
            change: marketData.usdMxn.change,
            icon: DollarSign,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            chartColor: "#10b981",
            data: charts.usd,
            prefix: "$"
        },
        {
            title: "Bitcoin",
            subtitle: "BTC/USD",
            value: marketData.btcUsd.price.toLocaleString(),
            change: marketData.btcUsd.change,
            icon: Coins,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            chartColor: "#f59e0b",
            data: charts.btc,
            prefix: "$"
        },
        {
            title: "Ethereum",
            subtitle: "ETH/USD",
            value: marketData.ethUsd.price.toLocaleString(),
            change: marketData.ethUsd.change,
            icon: Gem,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            chartColor: "#a855f7",
            data: charts.eth,
            prefix: "$"
        }
    ];

    return (
        <div className="space-y-8 pb-32 md:pb-8 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section with glassmorphism */}
            <div className="relative p-10 rounded-[2.5rem] glass-premium border-border/30 overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px] group-hover:bg-primary/30 transition-all duration-1000 animate-pulse-slow" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />

                <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary border border-primary/20 flex items-center justify-center shadow-xl shadow-primary/10">
                                <TrendingUp size={30} />
                            </div>
                            <div>
                                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground">Mercado & Intel</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 mt-1">Global Financial Monitor v2.5</p>
                            </div>
                        </div>
                        <p className="text-slate-400 font-medium max-w-xl leading-relaxed text-lg">
                            Análisis estratégico y monitoreo en tiempo real de activos clave para potenciar tu salud financiera.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <Button
                            variant="ghost"
                            className="rounded-2xl border border-border/30 bg-foreground/5 backdrop-blur-xl h-14 px-8 font-black tracking-widest uppercase text-xs transition-all hover:bg-foreground/10"
                            onClick={refresh}
                            disabled={loading}
                        >
                            <RefreshCcw size={18} className={cn("mr-3", loading && "animate-spin")} />
                            {loading ? "Sincronizando..." : "Actualizar Mercado"}
                        </Button>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="rounded-2xl h-14 px-8 font-black tracking-widest uppercase text-xs shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95">
                                    Explorar Activos
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md rounded-[2.5rem] glass-premium border-border/30">
                                <DialogHeader>
                                    <DialogTitle className="text-3xl font-black tracking-tighter flex items-center gap-3 text-foreground">
                                        <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                                            <Search size={22} />
                                        </div>
                                        Asset Explorer
                                    </DialogTitle>
                                    <DialogDescription className="font-black text-muted-foreground/60 uppercase tracking-widest text-[9px]">
                                        VanttFlow Global Connectivity
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-12 text-center space-y-6">
                                    <div className="w-28 h-28 bg-foreground/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-border/30 rotate-3 transition-transform hover:rotate-6 duration-700">
                                        <Zap size={44} className="text-primary/40 -rotate-3" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-black tracking-tighter text-foreground">Expansión Estratégica</h3>
                                        <p className="text-sm text-slate-400 max-w-[300px] mx-auto leading-relaxed font-medium">
                                            Integrando conexiones nativas con **NASDAQ**, **NYSE** y la **BMV** para una visibilidad total de tu portafolio.
                                        </p>
                                    </div>
                                    <div className="pt-4 px-4">
                                        <Button variant="outline" className="rounded-2xl w-full h-14 font-black tracking-widest uppercase text-[10px] border-border/30 bg-foreground/5" disabled>
                                            Lista de Espera VIP
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            {/* Price Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <div key={i} className="glass-card card-glow border-border/30 overflow-hidden group hover:-translate-y-2 transition-all duration-700 cursor-default">
                        <div className="p-8 pb-4">
                            <div className="flex justify-between items-start mb-6">
                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border border-border/30 transition-transform group-hover:scale-110 duration-500", stat.bg, stat.color)}>
                                    <stat.icon size={28} />
                                </div>
                                <div className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                    stat.change >= 0 
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                )}>
                                    {stat.change >= 0 ? <TrendingUp size={12} className="animate-bounce" /> : <TrendingDown size={12} />}
                                    {Math.abs(stat.change).toFixed(2)}%
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">{stat.title}</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black tracking-tight text-foreground group-hover:translate-x-1 transition-transform duration-500">{stat.prefix}{stat.value}</span>
                                    <span className="text-xs font-black text-primary/60 uppercase mb-1">{stat.subtitle.split('/')[1] || stat.subtitle}</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-40 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stat.data}>
                                    <defs>
                                        <linearGradient id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={stat.chartColor} stopOpacity={0.4} />
                                            <stop offset="95%" stopColor={stat.chartColor} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Outfit, sans-serif' }}
                                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                        labelStyle={{ display: 'none' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke={stat.chartColor}
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill={`url(#gradient-${i})`}
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Insight Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 glass-card border-border/30 overflow-hidden">
                    <div className="p-6 border-b border-border/30 flex items-center justify-between">
                        <h3 className="text-xl font-black tracking-tighter flex items-center gap-3">
                            <Filter size={20} className="text-primary" />
                            Macro Analysis de la Semana
                        </h3>
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground px-3 py-1 bg-foreground/5 rounded-full">Actualizado hace 2h</span>
                    </div>
                    <div className="p-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6 group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                        <TrendingUp size={20} />
                                    </div>
                                    <h4 className="font-black text-xs uppercase tracking-[0.2em] text-emerald-400">Fortaleza del Peso</h4>
                                </div>
                                <p className="text-base text-slate-400 leading-relaxed font-medium">
                                    El USD/MXN se mantiene en niveles críticos. Una ruptura por debajo de los {marketData.usdMxn.price.toFixed(2)} podría indicar una fase de apreciación mayor debido a flujos externos.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                                        <span>Índice de Confianza</span>
                                        <span>65%</span>
                                    </div>
                                    <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: '65%' }} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-6 group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                                        <Zap size={20} />
                                    </div>
                                    <h4 className="font-black text-xs uppercase tracking-[0.2em] text-amber-400">Cripto Sentiment</h4>
                                </div>
                                <p className="text-base text-slate-400 leading-relaxed font-medium">
                                    Bitcoin muestra una consolidación saludable cerca de los ${(marketData.btcUsd.price / 1000).toFixed(0)}k. El mercado espera una reducción en la volatilidad global.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                                        <span>Miedo vs Codicia (Vantt)</span>
                                        <span>42 - Neutral</span>
                                    </div>
                                    <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-1000" style={{ width: '42%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 glass-premium card-glow border-primary/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                        <TrendingUp size={160} />
                    </div>
                    <div className="p-10 flex flex-col h-full justify-between relative z-10">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/10">
                                <Sparkles size={24} />
                            </div>
                            <span className="text-[10px] font-black uppercase text-primary tracking-[0.4em] mb-3 block">Smart Insights</span>
                            <h3 className="text-3xl font-black tracking-tighter text-foreground mb-6 leading-tight">Vantt Intelligence Engine</h3>
                            <p className="text-base text-slate-400 mb-8 leading-relaxed font-medium">
                                Basado en tus patrones de gasto y el tipo de cambio actual, detectamos una oportunidad para optimizar tus pagos internacionales.
                            </p>
                        </div>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full h-14 rounded-2xl bg-primary text-foreground shadow-2xl shadow-primary/40 font-black tracking-widest uppercase text-[10px] transition-all hover:scale-105 active:scale-95">
                                    Ver Análisis Completo
                                    <ArrowRight size={18} className="ml-3" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md rounded-[2.5rem] glass-premium border-border/30">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black tracking-tighter text-foreground">Market Intelligence</DialogTitle>
                                    <DialogDescription className="font-black text-primary/60 uppercase tracking-widest text-[9px]">Análisis predictivo de flujo</DialogDescription>
                                </DialogHeader>
                                <MarketInsights data={marketData} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
};
