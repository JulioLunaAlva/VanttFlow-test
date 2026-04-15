import React from 'react';
import { useMarket } from '@/context/MarketContext';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Coins, Gem, CandlestickChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const MarketTrendsWidget = () => {
    const { t } = useTranslation();
    const { marketData, loading } = useMarket();

    const items = [
        {
            label: t('dashboard.dollar'),
            value: marketData.usdMxn.price.toFixed(2),
            change: marketData.usdMxn.change,
            icon: DollarSign,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            suffix: " MXN"
        },
        {
            label: t('dashboard.bitcoin'),
            value: (marketData.btcUsd.price / 1000).toFixed(1),
            change: marketData.btcUsd.change,
            icon: Coins,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            suffix: "K USD"
        },
        {
            label: t('dashboard.ethereum'),
            value: marketData.ethUsd.price.toFixed(2),
            change: marketData.ethUsd.change,
            icon: Gem,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            suffix: " USD"
        },
    ];

    const getMarketTip = () => {
        const { usdMxn, btcUsd, ethUsd } = marketData;
        if (usdMxn.change > 2) return t('dashboard.market_tips.usd_high');
        if (usdMxn.price < 19.5) return t('dashboard.market_tips.usd_stable');
        if (btcUsd.change > 5 || ethUsd.change > 5) return t('dashboard.market_tips.crypto_up');
        if (btcUsd.change < -5 || ethUsd.change < -5) return t('dashboard.market_tips.crypto_down');
        return t('dashboard.market_tips.low_volatility');
    };

    if (loading && marketData.usdMxn.price) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-[2rem] animate-pulse">
                <CandlestickChart className="text-muted-foreground/20 animate-bounce" size={40} />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col relative group overflow-hidden">
            {/* Background mystical glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] group-hover:bg-primary/20 transition-all duration-700" />
            
            <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-10">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-primary/10 text-primary shadow-lg transition-transform duration-500 group-hover:scale-110">
                        <CandlestickChart size={20} />
                    </span>
                    {t('dashboard.market_pulses')}
                </h3>
                <Link to="/market" className="text-[10px] font-black text-primary hover:text-primary/80 uppercase tracking-widest px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 transition-all active:scale-95">
                    {t('dashboard.view_all')}
                </Link>
            </div>
            
            <div className="p-6 flex-1 flex flex-col relative z-10">
                <div className="space-y-5">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between group/row">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "p-3 rounded-2xl transition-all duration-500 group-hover/row:scale-110 shadow-lg border border-white/5",
                                    item.bg, 
                                    item.color
                                )}>
                                    <item.icon size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] leading-none mb-2">{item.label}</p>
                                    <p className="text-xl font-black tracking-tighter leading-none">
                                        {item.value}<span className="text-[10px] text-muted-foreground/30 font-black ml-1 uppercase">{item.suffix}</span>
                                    </p>
                                </div>
                            </div>
                            <div className={cn(
                                "flex items-center gap-1.5 font-black text-[10px] px-3 py-1.5 rounded-xl border transition-all duration-500 group-hover/row:scale-105",
                                item.change >= 0 
                                    ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]" 
                                    : "text-rose-400 bg-rose-400/10 border-rose-400/20 shadow-[0_0_10px_rgba(251,113,133,0.1)]"
                            )}>
                                {item.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                {Math.abs(item.change).toFixed(1)}%
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-8 p-5 rounded-[2rem] glass-premium border border-white/10 relative overflow-hidden group/tip group-hover:border-primary/30 transition-all duration-500">
                    {/* Inner glow for the tip */}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-700" />
                    
                    <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none transition-transform group-hover/tip:rotate-12 group-hover/tip:scale-150 duration-700">
                        <TrendingUp size={100} />
                    </div>
                    
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2 drop-shadow-sm">{t('dashboard.smart_market')}</p>
                        <p className="text-xs text-foreground/80 leading-relaxed font-bold italic group-hover:text-foreground transition-colors">
                            "{getMarketTip()}"
                        </p>
                    </div>
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
        </div>
    );
};