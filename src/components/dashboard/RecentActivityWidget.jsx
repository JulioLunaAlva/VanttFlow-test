import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useFinance } from "@/context/FinanceContext";
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft } from 'lucide-react';
import { format } from 'date-fns';
import { enUS, es, ptBR, fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useIdentity } from '@/context/IdentityContext';
import { cn, parseLocalDateStr } from '@/lib/utils';

const locales = { es, en: enUS, pt: ptBR, fr };
export const RecentActivityWidget = () => {
    const { t, i18n } = useTranslation();
    const { user } = useIdentity();
    const { filteredTransactions, categories } = useFinance();
    const navigate = useNavigate();

    const currentLocale = locales[i18n.language.split('-')[0]] || es;
    // Get the most recent 5 transactions
    const recentTransactions = [...filteredTransactions]
        .sort((a, b) => parseLocalDateStr(b.date) - parseLocalDateStr(a.date))
        .slice(0, 5);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: user?.currency || 'MXN'
        }).format(amount);
    };
    return (
        <div className="h-full flex flex-col">
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight">{t('dashboard.activity')}</h3>
                <Button 
                    variant="ghost" 
                    className="text-[10px] h-auto p-2 font-black uppercase text-primary hover:bg-primary/10 rounded-xl" 
                    onClick={() => navigate('/transactions')}
                >
                    {t('dashboard.view_all')}
                </Button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                <div className="space-y-6">
                    {recentTransactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                            <div className="w-16 h-16 bg-foreground/5 rounded-[2rem] flex items-center justify-center border border-border/50 shadow-inner">
                                <ArrowUpRight size={32} className="rotate-45 text-muted-foreground/30" />
                            </div>
                            <div>
                                <p className="font-black text-sm tracking-tight">{t('dashboard.no_activity')}</p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 mt-1">{t('dashboard.activity_hint')}</p>
                            </div>
                        </div>
                    ) : (
                        recentTransactions.map(t => {
                            const category = categories.find(c => c.id === t.category);
                            return (
                                <div key={t.id} className="group relative flex items-center justify-between p-1">
                                    <div className="flex items-center gap-4 min-w-0 flex-1">
                                        <div className={cn(
                                            "w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 border",
                                            t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                            t.type === 'expense' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                            'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                        )}>
                                            {t.type === 'income' ? <ArrowUpRight size={22} strokeWidth={2.5} /> :
                                                t.type === 'expense' ? <ArrowDownLeft size={22} strokeWidth={2.5} /> :
                                                    <ArrowRightLeft size={22} strokeWidth={2.5} />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-black text-xl tracking-tight truncate group-hover:text-primary transition-colors leading-none">{t.description}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest opacity-60">
                                                    {format(parseLocalDateStr(t.date), 'dd MMM', { locale: currentLocale })}
                                                </span>
                                                {category && (
                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-foreground/5 border border-border/50">
                                                        <div 
                                                            className="w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor]" 
                                                            style={{ backgroundColor: category.color, color: category.color }} 
                                                        />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">{category.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-4">
                                        <span className={cn(
                                            "text-2xl font-black tracking-tighter block",
                                            t.type === 'income' ? 'text-emerald-500' :
                                            t.type === 'expense' ? 'text-rose-500' : 'text-blue-500'
                                        )}>
                                            {t.type === 'expense' ? '-' : '+'}{formatCurrency(t.amount)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};