import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { TrendingUp, Shield, CreditCard, PiggyBank, Award } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';

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
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Award className="h-4 w-4 text-purple-500" />
                    {t('dashboard.vanttscore')}
                </CardTitle>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-muted ${statusColor}`}>{status}</span>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    {/* Gauge Chart */}
                    <div className="h-32 w-32 relative flex-shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={55}
                                    startAngle={180}
                                    endAngle={0}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell key="cell-0" fill={total >= 700 ? "#10b981" : total >= 500 ? "#3b82f6" : "#f97316"} />
                                    <Cell key="cell-1" fill="#e2e8f0" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                            <span className="text-2xl font-bold">{total}</span>
                            <span className="text-[10px] text-muted-foreground">/1000</span>
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="flex-1 space-y-2">
                        {[
                            { icon: Shield, label: 'liquidity', value: details.liquidity, color: 'bg-blue-500' },
                            { icon: CreditCard, label: 'debt', value: details.debt, color: 'bg-purple-500' },
                            { icon: TrendingUp, label: 'growth', value: details.growth, color: 'bg-emerald-500' },
                            { icon: PiggyBank, label: 'savings', value: details.savings, color: 'bg-amber-500' },
                            { icon: Award, label: 'discipline', value: details.discipline, color: 'bg-pink-500' }
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between text-[10px]">
                                <div className="flex items-center gap-1.5 text-muted-foreground whitespace-nowrap">
                                    <item.icon size={10} /> {t(`dashboard.vantt_score.${item.label}`)}
                                </div>
                                <div className="h-1 w-12 bg-muted rounded-full overflow-hidden ml-2">
                                    <div className={`h-full ${item.color}`} style={{ width: `${(item.value / 200) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <p className="text-[10px] text-center text-muted-foreground mt-2 italic">
                    {t('dashboard.vantt_score.footer')}
                </p>
            </CardContent>
        </Card>
    );
};
