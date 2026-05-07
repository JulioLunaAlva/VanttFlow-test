import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { TrendingUp, Shield, CreditCard, PiggyBank, Award } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';
import { cn } from "@/lib/utils";

export const VanttScoreWidget = () => {
    const { t } = useTranslation();
    const { getVanttScore } = useFinance();
    const { total, details } = getVanttScore();

    let status = t('dashboard.vantt_score.calculating');
    let statusColor = "text-muted-foreground";

    if (total >= 850) { status = t('dashboard.vantt_score.legend'); statusColor = "text-yellow-500"; }
    else if (total >= 700) { status = t('dashboard.vantt_score.solid'); statusColor = "text-emerald-500"; }
    else if (total >= 500) { status = t('dashboard.vantt_score.on_track'); statusColor = "text-blue-500"; }
    else { status = t('dashboard.vantt_score.building'); statusColor = "text-orange-500"; }

    const data = [
        { name: 'Score', value: total },
        { name: 'Remaining', value: 1000 - total }
    ];

    return (
        <div className="h-full flex flex-col relative group overflow-hidden">
            <div className="p-6 border-b border-border/30 flex items-center justify-between relative z-10">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-purple-500/10 text-purple-500 shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <Award size={20} />
                    </span>
                    {t('dashboard.vanttscore')}
                </h3>
                <div className={cn(
                    "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                    total >= 700 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                    total >= 500 ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                    "bg-orange-500/10 text-orange-500 border-orange-500/20"
                )}>
                    {status}
                </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col relative z-10">
                <div className="flex items-center gap-6">
                    {/* Gauge Chart */}
                    <div className="h-40 w-40 relative flex-shrink-0 group/gauge">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    startAngle={180}
                                    endAngle={0}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    <Cell 
                                        key="cell-0" 
                                        fill={total >= 700 ? "#10b981" : total >= 500 ? "#3b82f6" : "#f97316"} 
                                        className="drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                                    />
                                    <Cell key="cell-1" fill="rgba(255,255,255,0.05)" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
                            <span className="text-4xl font-black tracking-tighter group-hover/gauge:scale-110 transition-transform duration-500">{total}</span>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">/1000</span>
                        </div>
                        
                        {/* Glow under the gauge */}
                        <div className={cn(
                            "absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-4 rounded-full blur-[20px] opacity-20",
                            total >= 700 ? "bg-emerald-500" : total >= 500 ? "bg-blue-500" : "bg-orange-500"
                        )} />
                    </div>

                    {/* Breakdown */}
                    <div className="flex-1 space-y-3">
                        {[
                            { icon: Shield, label: 'liquidity', value: details.liquidity, color: 'text-blue-500', bg: 'bg-blue-500' },
                            { icon: CreditCard, label: 'debt', value: details.debt, color: 'text-purple-500', bg: 'bg-purple-500' },
                            { icon: TrendingUp, label: 'growth', value: details.growth, color: 'text-emerald-500', bg: 'bg-emerald-500' },
                            { icon: PiggyBank, label: 'savings', value: details.savings, color: 'text-amber-500', bg: 'bg-amber-500' },
                            { icon: Award, label: 'discipline', value: details.discipline, color: 'text-pink-500', bg: 'bg-pink-500' }
                        ].map((item) => (
                            <div key={item.label} className="space-y-1 group/item">
                                <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">
                                    <div className="flex items-center gap-1.5 group-hover/item:text-foreground transition-colors">
                                        <item.icon size={10} className={item.color} /> {t(`dashboard.vantt_score.${item.label}`)}
                                    </div>
                                    <span className="group-hover/item:text-foreground">{item.value}</span>
                                </div>
                                <div className="h-1 w-full bg-foreground/5 rounded-full overflow-hidden border border-border/30">
                                    <div 
                                        className={cn("h-full transition-all duration-1000", item.bg)} 
                                        style={{ width: `${(item.value / 200) * 100}%` }} 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-border/30">
                    <p className="text-[10px] font-bold text-center text-muted-foreground/40 uppercase tracking-widest leading-relaxed italic">
                        {t('dashboard.vantt_score.footer')}
                    </p>
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px]" />
        </div>
    );
};
