import React, { useState, useEffect } from 'react';
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { ExpensePieChart } from "@/components/dashboard/ExpensePieChart";
import { BalanceBarChart } from "@/components/dashboard/BalanceBarChart";
import { PendingPaymentsWidget } from '@/components/dashboard/PendingPaymentsWidget';
import { RecentActivityWidget } from '@/components/dashboard/RecentActivityWidget';
import { GoalsSummaryWidget } from '@/components/dashboard/GoalsSummaryWidget';
import { GamificationWidget } from '@/components/gamification/GamificationWidget';
import { SavingPowerWidget } from '@/components/gamification/SavingPowerWidget';
import { DailyMissionsWidget } from '@/components/gamification/DailyMissionsWidget';
import { MarketTrendsWidget } from '@/components/dashboard/MarketTrendsWidget';
import { ForecastWidget } from '@/components/dashboard/ForecastWidget';
import { VanttScoreWidget } from '@/components/dashboard/VanttScoreWidget';
import { OracleWidget } from '@/components/dashboard/OracleWidget';
import { AccountsWidget } from '@/components/dashboard/AccountsWidget';
import { Button } from "@/components/ui/button";
import { RotateCcw, GripHorizontal, Check, Settings2, Plus, Layout as LayoutIcon, CalendarIcon, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useFinance } from '@/context/FinanceContext';
import { useTranslation } from 'react-i18next';

const WelcomeHeader = () => {
    const { t } = useTranslation();
    return (
        <div className="relative overflow-hidden glass-premium p-8 md:p-12 rounded-[2.5rem] border-white/10 animate-in fade-in zoom-in duration-1000 group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/5 opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />
            
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
                <div className="w-20 h-20 md:w-28 md:h-28 glass-premium rounded-3xl flex items-center justify-center shadow-2xl border-white/20 flex-shrink-0 animate-bounce-slow">
                    <span className="text-4xl md:text-6xl drop-shadow-lg">🚀</span>
                </div>
                <div className="text-center md:text-left space-y-3">
                    <h3 className="text-2xl md:text-4xl font-black tracking-tighter text-foreground leading-tight">
                        {t('dashboard.welcome_title')}
                    </h3>
                    <p className="text-muted-foreground text-sm md:text-base max-w-2xl font-medium leading-relaxed">
                        {t('dashboard.welcome_desc')}
                    </p>
                </div>
            </div>
        </div>
    );
};

const WIDGETS_CONFIG = [
    { id: 'balance', component: BalanceBarChart, labelKey: 'dashboard.balance', className: 'lg:col-span-4 md:col-span-2' },
    { id: 'forecast', component: ForecastWidget, labelKey: 'dashboard.forecast', className: 'lg:col-span-3 md:col-span-2' },
    { id: 'vanttscore', component: VanttScoreWidget, labelKey: 'dashboard.vanttscore', className: 'lg:col-span-2 md:col-span-2' },
    { id: 'accounts_breakdown', component: AccountsWidget, labelKey: 'dashboard.accounts_breakdown', className: 'lg:col-span-2 md:col-span-2' },
    { id: 'oracle', component: OracleWidget, labelKey: 'dashboard.oracle', className: 'lg:col-span-2 md:col-span-2' },
    { id: 'activity', component: RecentActivityWidget, labelKey: 'dashboard.activity', className: 'lg:col-span-3 md:col-span-2' },
    { id: 'expenses', component: ExpensePieChart, labelKey: 'dashboard.expenses', className: 'lg:col-span-4 md:col-span-2' },
    { id: 'goals', component: GoalsSummaryWidget, labelKey: 'dashboard.goals_progress', className: 'lg:col-span-3 md:col-span-2' },
    { id: 'gamification', component: GamificationWidget, labelKey: 'dashboard.gamification', className: 'lg:col-span-4 md:col-span-2' },
    { id: 'saving', component: SavingPowerWidget, labelKey: 'dashboard.saving', className: 'lg:col-span-3 md:col-span-2' },
    { id: 'missions', component: DailyMissionsWidget, labelKey: 'dashboard.missions', className: 'lg:col-span-4 md:col-span-2' },
    { id: 'market', component: MarketTrendsWidget, labelKey: 'dashboard.market', className: 'lg:col-span-3 md:col-span-2' },
    { id: 'pending', component: PendingPaymentsWidget, labelKey: 'dashboard.pending', className: 'lg:col-span-7 md:col-span-2' }
];

export const DashboardPage = () => {
    const { t } = useTranslation();
    const { transactions } = useFinance();
    const isNewUser = transactions.length === 0;
    const [order, setOrder] = useState(() => {
        const saved = localStorage.getItem('dashboard_layout');
        return saved ? JSON.parse(saved) : WIDGETS_CONFIG.map(w => w.id);
    });

    const [visibility, setVisibility] = useState(() => {
        const saved = localStorage.getItem('dashboard_visibility');
        const defaultVisibility = {};
        WIDGETS_CONFIG.forEach(w => defaultVisibility[w.id] = true);
        return saved ? { ...defaultVisibility, ...JSON.parse(saved) } : defaultVisibility;
    });

    // Validar si hay nuevos widgets que no estan en el orden guardado
    useEffect(() => {
        const currentIds = new Set(WIDGETS_CONFIG.map(w => w.id));
        const savedIds = new Set(order);

        // Si hay discrepancia (nuevos widgets), resetear/mezclar
        const hasMissing = order.length < WIDGETS_CONFIG.length;
        if (hasMissing) {
            const validSaved = order.filter(id => currentIds.has(id));
            const newItems = WIDGETS_CONFIG.filter(w => !order.includes(w.id)).map(w => w.id);
            setOrder([...validSaved, ...newItems]);
        }
    }, [order.length]);

    const saveOrder = (newOrder, persist = false) => {
        setOrder(newOrder);
        if (persist) {
            localStorage.setItem('dashboard_layout', JSON.stringify(newOrder));
        }
    };

    const toggleVisibility = (id) => {
        const newVisibility = { ...visibility, [id]: !visibility[id] };
        setVisibility(newVisibility);
        localStorage.setItem('dashboard_visibility', JSON.stringify(newVisibility));
        const widgetLabel = t(WIDGETS_CONFIG.find(w => w.id === id)?.labelKey);
        toast.success(`${visibility[id] ? t('dashboard.hidden_toast') : t('dashboard.shown_toast')}: ${widgetLabel}`);
    };

    const moveWidget = (index, direction) => {
        const newOrder = [...order];
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex >= 0 && newIndex < newOrder.length) {
            const temp = newOrder[index];
            newOrder[index] = newOrder[newIndex];
            newOrder[newIndex] = temp;
            saveOrder(newOrder, true); // Persist on manual move (arrows)
        }
    };

    const resetLayout = () => {
        const defaultOrder = WIDGETS_CONFIG.map(w => w.id);
        const defaultVisibility = {};
        WIDGETS_CONFIG.forEach(w => defaultVisibility[w.id] = true);
        saveOrder(defaultOrder, true);
        setVisibility(defaultVisibility);
        localStorage.setItem('dashboard_visibility', JSON.stringify(defaultVisibility));
        toast.info(t("dashboard.reset_toast"));
    };

    const [isEditMode, setIsEditMode] = useState(false);

    // Drag & Drop Handlers
    const [draggedItem, setDraggedItem] = useState(null);

    const handleDragStart = (e, index) => {
        if (!isEditMode) {
            e.preventDefault();
            return;
        }
        setDraggedItem(index);
        e.dataTransfer.effectAllowed = "move";
        e.target.style.opacity = '0.5';
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
        setDraggedItem(null);
        // Persist when the drag officially ends
        localStorage.setItem('dashboard_layout', JSON.stringify(order));
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";

        if (draggedItem === null) return;
        if (draggedItem === index) return;

        // Reorder on hover logic for smoother feel
        const newOrder = [...order];
        const item = newOrder[draggedItem];
        newOrder.splice(draggedItem, 1);
        newOrder.splice(index, 0, item);

        setDraggedItem(index);
        saveOrder(newOrder, false); // Don't persist on every move
    };

    return (
        <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-4 pb-24 md:pb-0">
            <div className="flex justify-between items-center glass-premium p-8 rounded-[2.5rem] border-white/10 mb-8 mt-4 group">
                <div className="relative z-10">
                    <h2 className="text-4xl font-black tracking-tighter text-foreground drop-shadow-2xl">{t('common.dashboard')}</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mt-3 opacity-60 group-hover:opacity-100 transition-opacity">
                        {isEditMode
                            ? (window.innerWidth < 768 ? t('dashboard.edit_mode_touch') : t('dashboard.edit_mode_drag'))
                            : t('dashboard.activity_desc')}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant={isEditMode ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIsEditMode(!isEditMode)}
                        className="gap-3 rounded-2xl font-black uppercase tracking-widest h-12 px-8 shadow-2xl transition-all active:scale-95 border-white/10"
                    >
                        {isEditMode ? <Check size={18} className="text-white" /> : <Settings2 size={18} />}
                        {isEditMode ? t('dashboard.finish_edit') : t('dashboard.customize')}
                    </Button>
                    {isEditMode && (
                        <Button variant="ghost" size="icon" onClick={resetLayout} title="Restablecer original" className="rounded-2xl h-12 w-12 hover:bg-white/10 hover:text-primary transition-all">
                            <RotateCcw size={20} />
                        </Button>
                    )}
                </div>
            </div>

            {isNewUser && <WelcomeHeader />}

            {/* Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-8">
                {order.map((widgetId, index) => {
                    const widgetConfig = WIDGETS_CONFIG.find(w => w.id === widgetId);
                    if (!widgetConfig) return null;
                    const WidgetComponent = widgetConfig.component;

                    return (
                        <div
                            key={widgetId}
                            draggable={isEditMode}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOver(e, index)}
                            style={{ display: visibility[widgetId] || isEditMode ? 'block' : 'none' }}
                            id={widgetId === 'goals' ? 'tour-goals' : widgetId === 'gamification' ? 'tour-gamification' : widgetId === 'balance' ? 'tour-analytics' : undefined}
                            className={`
                                ${widgetConfig.className} 
                                relative group transition-all duration-700
                                glass-premium rounded-[2.5rem] border-white/10 overflow-hidden min-h-[320px] h-full flex flex-col
                                ${isEditMode ? 'cursor-grab active:cursor-grabbing ring-4 ring-primary ring-offset-4 bg-card/80 backdrop-blur-3xl z-50 scale-105 shadow-[0_0_80px_rgba(var(--primary),0.3)]' : ''}
                                ${draggedItem === index ? 'opacity-30 scale-95 blur-[4px]' : ''}
                                ${!visibility[widgetId] && isEditMode ? 'opacity-40 grayscale blur-[2px]' : ''}
                            `}
                        >
                            {/* Edit Overlay / Handle - Visible only in Edit Mode */}
                            {isEditMode && (
                                <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] rounded-xl flex flex-col items-center justify-center z-50 border-2 border-dashed border-primary/50 pointer-events-none p-4">
                                    <div className="absolute top-4 right-4 pointer-events-auto">
                                        <Button
                                            size="icon"
                                            variant={visibility[widgetId] ? "secondary" : "destructive"}
                                            className="h-10 w-10 rounded-full shadow-2xl border border-white/10 transition-all hover:scale-110 active:scale-90"
                                            onClick={() => toggleVisibility(widgetId)}
                                            title={visibility[widgetId] ? "Ocultar" : "Mostrar"}
                                        >
                                            {visibility[widgetId] ? <Eye size={14} /> : <EyeOff size={14} />}
                                        </Button>
                                    </div>
                                    <div className="bg-background shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium animate-in fade-in zoom-in hidden md:flex">
                                        <GripHorizontal size={16} />
                                        {t('dashboard.move_widget')} {t(widgetConfig.labelKey)}
                                    </div>

                                    {/* Mobile Reordering Controls */}
                                    <div className="md:hidden flex flex-col gap-4 pointer-events-auto">
                                        <div className="text-center mb-1">
                                            <span className="text-xs font-bold uppercase tracking-wider text-primary">{t(widgetConfig.labelKey)}</span>
                                        </div>
                                        <div className="flex gap-4">
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="h-14 w-14 rounded-2xl shadow-lg border border-primary/20 bg-background/80"
                                                onClick={() => moveWidget(index, 'up')}
                                                disabled={index === 0}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up"><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></svg>
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="h-14 w-14 rounded-2xl shadow-lg border border-primary/20 bg-background/80"
                                                onClick={() => moveWidget(index, 'down')}
                                                disabled={index === order.length - 1}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down"><path d="m19 12-7 7-7-7" /><path d="M12 5v14" /></svg>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Block interaction with charts while editing to prevent conflicts */}
                            <div className={isEditMode ? "opacity-30 blur-sm scale-[0.98] transition-all" : "h-full"}>
                                <WidgetComponent />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
