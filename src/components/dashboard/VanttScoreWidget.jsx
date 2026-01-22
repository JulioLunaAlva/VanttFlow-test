import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { TrendingUp, Shield, CreditCard, PiggyBank, Award } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const VanttScoreWidget = () => {
    const { getVanttScore } = useFinance();
    const { total, details } = getVanttScore();

    let status = "Calculando...";
    let statusColor = "text-muted-foreground";

    if (total >= 850) { status = "Modo Leyenda 🏆"; statusColor = "text-yellow-500"; }
    else if (total >= 700) { status = "Sólido 🦍"; statusColor = "text-emerald-500"; }
    else if (total >= 500) { status = "En Camino 🚶"; statusColor = "text-blue-500"; }
    else { status = "En Construcción 🚧"; statusColor = "text-orange-500"; }

    const data = [
        { name: 'Score', value: total },
        { name: 'Remaining', value: 1000 - total }
    ];

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Award className="h-4 w-4 text-purple-500" />
                    VanttScore
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
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Shield size={12} /> Liquidez
                            </div>
                            <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: `${(details.liquidity / 250) * 100}%` }} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <CreditCard size={12} /> Deuda
                            </div>
                            <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500" style={{ width: `${(details.debt / 250) * 100}%` }} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <TrendingUp size={12} /> Crecimiento
                            </div>
                            <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: `${(details.growth / 250) * 100}%` }} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <PiggyBank size={12} /> Ahorro
                            </div>
                            <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500" style={{ width: `${(details.savings / 250) * 100}%` }} />
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-[10px] text-center text-muted-foreground mt-2 italic">
                    Mantén tus métricas en verde para subir de nivel.
                </p>
            </CardContent>
        </Card>
    );
};
