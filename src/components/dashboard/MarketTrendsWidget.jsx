import React from 'react';
import { useMarket } from '@/context/MarketContext';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Coins, Gem, CandlestickChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
export const MarketTrendsWidget = () => {
    const { marketData, loading } = useMarket();
    const items = [
        {
            label: "Dólar",
            value: marketData.usdMxn.price.toFixed(2),
            change: marketData.usdMxn.change,
            icon: DollarSign,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            suffix: " MXN"
        },
        {
            label: "Bitcoin",
            value: (marketData.btcUsd.price / 1000).toFixed(1),
            change: marketData.btcUsd.change,
            icon: Coins,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            suffix: "K USD"
        },
        {
            label: "NVIDIA",
            value: marketData.nvdaStock.price.toFixed(0),
            change: marketData.nvdaStock.change,
            icon: Gem,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            suffix: " USD"
        },
    ];
    if (loading && marketData.usdMxn.price) {
        return (
            <Card className="h-full animate-pulse border-border/40 bg-card/40">
                <CardContent className="h-full flex items-center justify-center">
                    <CandlestickChart className="text-muted-foreground/20 animate-bounce" size={40} />
                </CardContent>
            </Card>
        );
    }
    return (
        <Card className="overflow-hidden border-border/50 bg-card/40 backdrop-blur-xl group hover:shadow-[0_0_30px_rgba(var(--primary),0.1)] transition-all duration-500 flex flex-col h-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-muted-foreground">
                        <CandlestickChart className="h-3 w-3 text-primary" />
                        Pulsos del Mercado
                    </CardTitle>
                    <Link to="/market" className="text-[10px] font-black text-primary hover:underline uppercase tracking-tighter"> Ver todo </Link>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between pt-0">
                <div className="space-y-4">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between group/row">
                            <div className="flex items-center gap-3">
                                <div className={cn("p-2 rounded-xl transition-transform group-hover/row:scale-110 duration-300", item.bg, item.color)}>
                                    <item.icon size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                                    <p className="text-lg font-black tracking-tight leading-none">
                                        {item.value}<span className="text-[10px] text-muted-foreground/40 font-bold ml-1">{item.suffix}</span>
                                    </p>
                                </div>
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 font-black text-[10px] px-2 py-1 rounded-lg",
                                item.change >= 0 ? "text-emerald-500 bg-emerald-500/5" : "text-red-500 bg-red-500/5"
                            )}>
                                {item.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                {Math.abs(item.change).toFixed(1)}%
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 p-3 rounded-2xl bg-primary/5 border border-primary/10 relative overflow-hidden group/tip">
                    <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none transition-transform group-hover/tip:scale-125 duration-700">
                        <TrendingUp size={60} />
                    </div>
                    <p className="text-[9px] font-bold text-primary/80 uppercase tracking-widest mb-1">Mercado Inteligente</p>
                    <p className="text-[10px] text-foreground/70 leading-tight font-medium">
                        El peso está fuerte hoy. Es un buen momento para liquidar deudas en dólares.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};