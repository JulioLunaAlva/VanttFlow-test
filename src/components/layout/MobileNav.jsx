import React, { useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import {
    LayoutDashboard, Receipt, Plus, BarChart3, MoreHorizontal,
    Zap, Target, CalendarClock, Upload, Tags, PieChart,
    Settings, CandlestickChart, BookOpen, Landmark,
    Sparkles, CreditCard
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { AccountForm } from '@/components/accounts/AccountForm';
import { GoalForm } from '@/components/goals/GoalForm';
import { CategoryForm } from '@/components/categories/CategoryForm';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHaptic } from '@/utils/haptic';
import { useTranslation } from 'react-i18next';
import { useFinance } from '@/context/FinanceContext';

// ─────────────────────────────────────────────
// Tab item individual
// ─────────────────────────────────────────────
const NavTab = ({ to, icon: Icon, label, exact = false }) => (
    <NavLink
        to={to}
        end={exact}
        className={({ isActive }) => cn(
            "relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200 outline-none",
            isActive ? "text-primary" : "text-muted-foreground/60"
        )}
    >
        {({ isActive }) => (
            <>
                {/* Pill indicador activo */}
                {isActive && (
                    <motion.div
                        layoutId="nav-indicator"
                        className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-primary"
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                )}
                <Icon
                    size={24}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className="transition-transform duration-200"
                    style={{ transform: isActive ? 'scale(1.1)' : 'scale(1)' }}
                />
                <span className={cn(
                    "text-[11px] font-bold leading-none",
                    isActive ? "text-primary" : "text-muted-foreground/50"
                )}>
                    {label}
                </span>
            </>
        )}
    </NavLink>
);

// ─────────────────────────────────────────────
// Ítem del sheet de "Más"
// ─────────────────────────────────────────────
const MoreItem = ({ to, icon: Icon, label, iconBg, iconColor, onClose }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            onClick={onClose}
            className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-150 active:scale-[0.97]",
                isActive
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-foreground/5"
            )}
        >
            <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                iconBg
            )}>
                <Icon size={18} className={iconColor} />
            </div>
            <span className={cn(
                "text-base font-semibold",
                isActive ? "text-primary" : "text-foreground"
            )}>
                {label}
            </span>
            {isActive && (
                <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
            )}
        </Link>
    );
};

// ─────────────────────────────────────────────
// Botón de acción rápida en el sheet del +
// ─────────────────────────────────────────────
const QuickAction = ({ icon: Icon, label, iconBg, iconColor, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-foreground/4 hover:bg-foreground/8 active:scale-95 transition-all duration-150"
    >
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", iconBg)}>
            <Icon size={26} className={iconColor} />
        </div>
        <span className="text-sm font-bold text-center leading-tight">{label}</span>
    </button>
);

// ─────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────
export const MobileNav = () => {
    const { t } = useTranslation();
    const { addAccount, addGoal, addCategory } = useFinance();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
    const [activeAction, setActiveAction] = useState('transaction');

    // Long press para el botón +
    const [longPressTimer, setLongPressTimer] = useState(null);

    const handleTouchStart = () => {
        const timer = setTimeout(() => {
            triggerHaptic('heavy');
            setIsQuickMenuOpen(true);
            setLongPressTimer(null);
        }, 500);
        setLongPressTimer(timer);
    };

    const handleTouchEnd = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
            setActiveAction('transaction');
            setIsAddOpen(true);
            triggerHaptic('light');
        }
    };

    const handleActionClick = (action) => {
        setActiveAction(action);
        setIsQuickMenuOpen(false);
        setIsAddOpen(true);
        triggerHaptic('medium');
    };

    const getFormContent = () => {
        switch (activeAction) {
            case 'account':
                return {
                    title: t('common.quick_actions.new_account'),
                    form: <AccountForm onSubmit={(d) => { addAccount(d); setIsAddOpen(false); }} onCancel={() => setIsAddOpen(false)} />
                };
            case 'goal':
                return {
                    title: t('common.quick_actions.new_goal'),
                    form: <GoalForm onSubmit={(d) => { addGoal(d); setIsAddOpen(false); }} onCancel={() => setIsAddOpen(false)} />
                };
            case 'category':
                return {
                    title: t('common.quick_actions.new_category'),
                    form: <CategoryForm onSubmit={(d) => { addCategory(d); setIsAddOpen(false); }} onCancel={() => setIsAddOpen(false)} />
                };
            default:
                return {
                    title: t('common.quick_actions.new_transaction'),
                    form: <TransactionForm onSuccess={() => setIsAddOpen(false)} />
                };
        }
    };

    // Items del sheet "Más" — agrupados
    const moreSections = [
        {
            label: 'Finanzas',
            items: [
                { to: '/budget',        icon: PieChart,         label: t('common.budget'),        iconBg: 'bg-violet-500/10', iconColor: 'text-violet-500' },
                { to: '/goals',         icon: Target,           label: t('common.goals'),         iconBg: 'bg-pink-500/10',   iconColor: 'text-pink-500' },
                { to: '/subscriptions', icon: Zap,              label: t('common.subscriptions'), iconBg: 'bg-amber-500/10',  iconColor: 'text-amber-500' },
                { to: '/accounts',      icon: CreditCard,       label: t('common.accounts'),      iconBg: 'bg-blue-500/10',   iconColor: 'text-blue-500' },
            ]
        },
        {
            label: 'Herramientas',
            items: [
                { to: '/market',    icon: CandlestickChart, label: t('common.market'),    iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-500' },
                { to: '/calendar',  icon: CalendarClock,    label: 'Calendario',          iconBg: 'bg-sky-500/10',     iconColor: 'text-sky-500' },
                { to: '/notes',     icon: BookOpen,         label: t('common.notes') || 'Notas', iconBg: 'bg-indigo-500/10', iconColor: 'text-indigo-500' },
                { to: '/scheduled', icon: CalendarClock,    label: t('common.scheduled'), iconBg: 'bg-teal-500/10',    iconColor: 'text-teal-500' },
            ]
        },
        {
            label: 'Sistema',
            items: [
                { to: '/categories', icon: Tags,     label: t('common.categories'), iconBg: 'bg-orange-500/10', iconColor: 'text-orange-500' },
                { to: '/import',     icon: Upload,   label: t('common.import'),     iconBg: 'bg-gray-500/10',   iconColor: 'text-muted-foreground' },
                { to: '/settings',   icon: Settings, label: t('common.settings'),   iconBg: 'bg-gray-500/10',   iconColor: 'text-muted-foreground' },
            ]
        }
    ];

    const { title: formTitle, form: formComponent } = getFormContent();

    return (
        <>
            {/* ── Tab Bar Principal ── */}
            <nav className={cn(
                "md:hidden fixed bottom-0 left-0 right-0 z-50",
                "bg-background/95 backdrop-blur-xl",
                "border-t border-border/50",
                "shadow-[0_-1px_0_rgba(0,0,0,0.06),0_-8px_32px_rgba(0,0,0,0.08)]",
                "dark:shadow-[0_-1px_0_rgba(255,255,255,0.05),0_-8px_32px_rgba(0,0,0,0.4)]",
                "flex items-stretch justify-around",
                "h-[4.5rem] pb-safe"
            )}>

                {/* Tab 1: Dashboard */}
                <NavTab to="/" icon={LayoutDashboard} label={t('common.nav.home')} exact />

                {/* Tab 2: Transacciones */}
                <NavTab to="/transactions" icon={Receipt} label={t('common.nav.movs')} />

                {/* Tab 3: Botón + central */}
                <div className="relative flex flex-col items-center justify-center flex-shrink-0 px-4">
                    <button
                        className={cn(
                            "relative -top-3.5",
                            "h-14 w-14 rounded-full",
                            "bg-primary text-primary-foreground",
                            "flex items-center justify-center",
                            "shadow-[0_4px_24px_rgba(59,130,246,0.5)]",
                            "active:scale-90 transition-transform duration-150",
                            "border-4 border-background",
                            "select-none touch-none"
                        )}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={handleTouchStart}
                        onMouseUp={handleTouchEnd}
                        onMouseLeave={() => longPressTimer && (clearTimeout(longPressTimer), setLongPressTimer(null))}
                        aria-label="Agregar"
                    >
                        <Plus size={28} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Tab 4: Analítica */}
                <NavTab to="/analytics" icon={BarChart3} label={t('common.analytics')} />

                {/* Tab 5: Más (sheet) */}
                <Sheet open={isMoreOpen} onOpenChange={setIsMoreOpen}>
                    <SheetTrigger asChild>
                        <button className={cn(
                            "relative flex flex-col items-center justify-center flex-1 h-full gap-1 outline-none transition-all duration-200",
                            isMoreOpen ? "text-primary" : "text-muted-foreground/60"
                        )}>
                            {isMoreOpen && (
                                <motion.div
                                    layoutId="nav-indicator"
                                    className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-primary"
                                />
                            )}
                            <MoreHorizontal size={24} strokeWidth={isMoreOpen ? 2.5 : 1.8} />
                            <span className={cn("text-[11px] font-bold leading-none", isMoreOpen ? "text-primary" : "text-muted-foreground/50")}>
                                {t('common.nav.more')}
                            </span>
                        </button>
                    </SheetTrigger>

                    {/* Sheet "Más" */}
                    <SheetContent side="bottom" className="rounded-t-[1.75rem] border-border/40 bg-background p-0 max-h-[82dvh] overflow-y-auto">
                        {/* Handle */}
                        <div className="flex justify-center pt-3 pb-0">
                            <div className="w-10 h-1 rounded-full bg-foreground/15" />
                        </div>

                        <SheetHeader className="px-5 pt-4 pb-3 border-b border-border/40">
                            <SheetTitle className="text-xl font-black tracking-tight">
                                {t('common.nav.menu') || 'Menú'}
                            </SheetTitle>
                        </SheetHeader>

                        <div className="px-4 py-3 pb-8 space-y-5">
                            {moreSections.map((section) => (
                                <div key={section.label}>
                                    <p className="text-caption text-muted-foreground px-1 mb-2">{section.label}</p>
                                    <div className="space-y-0.5 rounded-2xl overflow-hidden bg-foreground/[0.03] border border-border/40">
                                        {section.items.map((item) => (
                                            <MoreItem
                                                key={item.to}
                                                {...item}
                                                onClose={() => setIsMoreOpen(false)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
            </nav>

            {/* ── Quick Action Menu (long press en +) ── */}
            <Sheet open={isQuickMenuOpen} onOpenChange={setIsQuickMenuOpen}>
                <SheetContent side="bottom" className="rounded-t-[1.75rem] border-border/40 bg-background p-0">
                    <div className="flex justify-center pt-3">
                        <div className="w-10 h-1 rounded-full bg-foreground/15" />
                    </div>
                    <SheetHeader className="px-5 pt-4 pb-3">
                        <SheetTitle className="text-xl font-black tracking-tight">
                            {t('common.quick_actions.title')}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="grid grid-cols-2 gap-3 px-5 pb-8">
                        <QuickAction
                            icon={Receipt}
                            label={t('common.quick_actions.new_transaction')}
                            iconBg="bg-blue-500/10"
                            iconColor="text-blue-500"
                            onClick={() => handleActionClick('transaction')}
                        />
                        <QuickAction
                            icon={Landmark}
                            label={t('common.quick_actions.new_account')}
                            iconBg="bg-emerald-500/10"
                            iconColor="text-emerald-500"
                            onClick={() => handleActionClick('account')}
                        />
                        <QuickAction
                            icon={Target}
                            label={t('common.quick_actions.new_goal')}
                            iconBg="bg-violet-500/10"
                            iconColor="text-violet-500"
                            onClick={() => handleActionClick('goal')}
                        />
                        <QuickAction
                            icon={Tags}
                            label={t('common.quick_actions.new_category')}
                            iconBg="bg-amber-500/10"
                            iconColor="text-amber-500"
                            onClick={() => handleActionClick('category')}
                        />
                    </div>
                </SheetContent>
            </Sheet>

            {/* ── Form Dialog (nueva transacción / cuenta / meta) ── */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{formTitle}</DialogTitle>
                    </DialogHeader>
                    <div className="px-5 pb-6">
                        {formComponent}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
