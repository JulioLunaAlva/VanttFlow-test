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
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium">{t('dashboard.activity')}</CardTitle>
                <Button variant="link" className="text-xs h-auto p-0" onClick={() => navigate('/transactions')}>
                    {t('dashboard.view_all')}
                </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
                <div className="space-y-4">
                    {recentTransactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center space-y-2 opacity-40">
                            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2">
                                <ArrowUpRight size={20} className="rotate-45" />
                            </div>
                            <p className="text-sm font-medium">{t('dashboard.no_activity')}</p>
                            <p className="text-xs text-muted-foreground">{t('dashboard.activity_hint')}</p>
                        </div>
                    ) : (
                        recentTransactions.map(t => (
                            <div key={t.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-full ${t.type === 'income' ? 'bg-green-100 text-green-600' :
                                        t.type === 'expense' ? 'bg-red-100 text-red-600' :
                                            'bg-blue-100 text-blue-600'
                                        }`}>
                                        {t.type === 'income' ? <ArrowUpRight size={14} /> :
                                            t.type === 'expense' ? <ArrowDownLeft size={14} /> :
                                                <ArrowRightLeft size={14} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm tracking-tight truncate leading-tight group-hover:text-primary transition-colors">{t.description}</p>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60 mt-1 flex items-center gap-1.5">
                                            {format(parseLocalDateStr(t.date), 'dd MMM', { locale: currentLocale })}
                                            {t.category && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-border" />
                                                    <span
                                                        className="w-2 h-2 rounded-full inline-block"
                                                        style={{ backgroundColor: categories.find(c => c.id === t.category)?.color || '#ccc' }}
                                                    />
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-green-600' :
                                    t.type === 'expense' ? 'text-red-600' : 'text-blue-600'
                                    }`}>
                                    {t.type === 'expense' ? '-' : '+'}{formatCurrency(t.amount)}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};