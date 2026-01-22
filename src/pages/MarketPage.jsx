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
    Zap
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
        nvda: generateChartData(marketData.nvdaStock.price, 0.015)
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
            title: "NVIDIA Corp.",
            subtitle: "NVDA:NASDAQ",
            value: marketData.nvdaStock.price.toFixed(2),
            change: marketData.nvdaStock.change,
            icon: Gem,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            chartColor: "#3b82f6",
            data: charts.nvda,
            prefix: "$"
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header section with glassmorphism */}
            <div className="relative p-8 rounded-[2.5rem] bg-card/40 border border-border/50 backdrop-blur-2xl overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all duration-1000" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                                <TrendingUp size={24} />
                            </div>
                            <h2 className="text-4xl font-black tracking-tighter">Mercado & Inteligencia</h2>
                        </div>
                        <p className="text-muted-foreground font-medium max-w-lg">
                            Monitor de activos clave y tipos de cambio para decisiones financieras estratégicas.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="rounded-2xl border-border/40 bg-background/50 backdrop-blur h-12 px-6"
                            onClick={refresh}
                            disabled={loading}
                        >
                            <RefreshCcw size={18} className={cn("mr-2", loading && "animate-spin")} />
                            {loading ? "Actualizando..." : "Refrescar Datos"}
                        </Button>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="rounded-2xl h-12 px-6 shadow-[0_8px_16px_rgba(var(--primary),0.2)]">
                                    Explorar Más
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md rounded-[2.5rem] border-border/40 bg-card/95 backdrop-blur-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                                        <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                                            <Search size={20} />
                                        </div>
                                        Buscador de Activos
                                    </DialogTitle>
                                    <DialogDescription className="font-bold text-muted-foreground/60 uppercase tracking-widest text-[10px]">
                                        VanttFlow v1.2 Beta
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-10 text-center space-y-5">
                                    <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-primary/20 rotate-3">
                                        <Zap size={40} className="text-primary/40 -rotate-3" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black tracking-tight">Expansión en Progreso</h3>
                                        <p className="text-sm text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                                            Estamos integrando conexiones con la **BMV**, **NASDAQ** y **NYSE** para que monitorees todo desde un solo lugar.
                                        </p>
                                    </div>
                                    <Button variant="outline" className="rounded-2xl w-full h-12 font-bold" disabled>
                                        Unirme a la Lista de Espera
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            {/* Price Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="overflow-hidden border-border/40 bg-card/60 backdrop-blur-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-500 group border-2 hover:border-primary/20">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className={cn("p-3 rounded-2xl shadow-sm", stat.bg, stat.color)}>
                                    <stat.icon size={22} />
                                </div>
                                <div className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                                    stat.change >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                                )}>
                                    {stat.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {Math.abs(stat.change).toFixed(2)}%
                                </div>
                            </div>
                            <div className="mt-4">
                                <CardTitle className="text-sm font-black text-muted-foreground uppercase tracking-widest">{stat.title}</CardTitle>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <span className="text-3xl font-black tracking-tight">{stat.prefix}{stat.value}</span>
                                    <span className="text-xs font-black text-muted-foreground/40">{stat.subtitle.split('/')[1] || stat.subtitle}</span>
                                </div>
                            </div>
                        </CardHeader>

                        <div className="h-32 w-full mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stat.data}>
                                    <defs>
                                        <linearGradient id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={stat.chartColor} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={stat.chartColor} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke={stat.chartColor}
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill={`url(#gradient-${i})`}
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Bottom Insight Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-border/40 bg-card/40 backdrop-blur overflow-hidden">
                    <CardHeader className="border-b border-border/10">
                        <CardTitle className="text-lg font-black flex items-center gap-2">
                            <Filter size={18} className="text-primary" />
                            Análisis Técnico de la Semana
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="font-black text-sm uppercase tracking-widest text-primary/60">Fortaleza del Peso</h4>
                                <p className="text-sm text-foreground/80 leading-relaxed">
                                    El USD/MXN se mantiene en niveles críticos. Una ruptura por debajo de los {marketData.usdMxn.price.toFixed(2)} podría indicar una fase de apreciación mayor debido a los flujos de inversión extranjera.
                                </p>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[65%]" />
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Índice de Confianza: 65%</span>
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-black text-sm uppercase tracking-widest text-primary/60">Cripto Sentiment</h4>
                                <p className="text-sm text-foreground/80 leading-relaxed">
                                    Bitcoin muestra una consolidación saludable cerca de los ${(marketData.btcUsd.price / 1000).toFixed(0)}k. El mercado espera una reducción en la volatilidad antes del próximo movimiento direccional.
                                </p>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 w-[42%]" />
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Miedo vs Codicia: 42 (Neutral)</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40 bg-primary/5 border-dashed border-2 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <TrendingUp size={120} />
                    </div>
                    <CardContent className="p-8 flex flex-col h-full justify-between relative z-10">
                        <div>
                            <span className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mb-2 block">Tip Pro</span>
                            <h3 className="text-2xl font-black tracking-tight mb-4 leading-tight">VanttFlow AI Insights</h3>
                            <p className="text-sm text-foreground/70 mb-6">
                                Basado en tus gastos de comida el mes pasado y el tipo de cambio actual, podrías ahorrar un 5% adicional si planeas tus compras de importados esta semana.
                            </p>
                        </div>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full rounded-2xl h-11 bg-primary text-primary-foreground group-hover:scale-[1.02] transition-transform">
                                    Ver Predicción Completa
                                    <ArrowRight size={16} className="ml-2" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md rounded-[2rem] border-border/40 bg-card/95 backdrop-blur-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black tracking-tight">Market Intelligence</DialogTitle>
                                    <DialogDescription className="font-bold text-primary/60 uppercase tracking-widest text-[10px]">Análisis predictivo global</DialogDescription>
                                </DialogHeader>
                                <MarketInsights data={marketData} />
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
