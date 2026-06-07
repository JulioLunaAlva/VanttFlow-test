import React, { useState, useRef } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import {
    LayoutDashboard, Receipt, Plus, BarChart3, MoreHorizontal,
    Zap, Target, CalendarClock, Upload, Tags, PieChart,
    Settings, CandlestickChart, BookOpen, Landmark,
    CreditCard, X, ChevronRight
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
// Tab individual — estilo Revolut con pill background animado
// ─────────────────────────────────────────────
const NavTab = ({ to, icon: Icon, label, exact = false, isActive: externalActive }) => {
    return (
        <NavLink
            to={to}
            end={exact}
            className="relative flex flex-col items-center justify-center flex-1 h-full gap-1 outline-none select-none touch-none"
            aria-label={label}
        >
            {({ isActive }) => {
                const active = externalActive !== undefined ? externalActive : isActive;
                return (
                    <>
                        {/* Pill background deslizante */}
                        {active && (
                            <motion.div
                                layoutId="tab-pill-bg"
                                className="absolute inset-x-1.5 inset-y-1.5 rounded-2xl bg-primary/10 dark:bg-primary/15"
                                transition={{ type: 'spring', stiffness: 500, damping: 42, mass: 0.8 }}
                            />
                        )}

                        {/* Dot indicator superior */}
                        <AnimatePresence>
                            {active && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                                />
                            )}
                        </AnimatePresence>

                        <Icon
                            size={21}
                            strokeWidth={active ? 2.3 : 1.7}
                            className={cn(
                                "relative z-10 transition-all duration-200",
                                active ? "text-primary" : "text-muted-foreground/55"
                            )}
                        />
                        <span className={cn(
                            "relative z-10 text-[10px] font-bold leading-none tracking-[-0.01em]",
                            "transition-all duration-200",
                            active ? "text-primary" : "text-muted-foreground/50"
                        )}>
                            {label}
                        </span>
                    </>
                );
            }}
        </NavLink>
    );
};

// ─────────────────────────────────────────────
// Botón Más — integrado en la nav bar
// ─────────────────────────────────────────────
const MoreTab = ({ isActive, onPress, label }) => (
    <button
        onClick={onPress}
        className="relative flex flex-col items-center justify-center flex-1 h-full gap-1 outline-none select-none"
        aria-label={label}
    >
        {isActive && (
            <motion.div
                layoutId="tab-pill-bg"
                className="absolute inset-x-1.5 inset-y-1.5 rounded-2xl bg-primary/10 dark:bg-primary/15"
                transition={{ type: 'spring', stiffness: 500, damping: 42, mass: 0.8 }}
            />
        )}

        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                />
            )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
            {isActive ? (
                <motion.div
                    key="close"
                    initial={{ rotate: -45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 45, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="relative z-10"
                >
                    <MoreHorizontal
                        size={21}
                        strokeWidth={2.3}
                        className="text-primary"
                    />
                </motion.div>
            ) : (
                <motion.div
                    key="open"
                    initial={{ rotate: 45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -45, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="relative z-10"
                >
                    <MoreHorizontal
                        size={21}
                        strokeWidth={1.7}
                        className="text-muted-foreground/55"
                    />
                </motion.div>
            )}
        </AnimatePresence>

        <span className={cn(
            "relative z-10 text-[10px] font-bold leading-none tracking-[-0.01em] transition-all duration-200",
            isActive ? "text-primary" : "text-muted-foreground/50"
        )}>
            {label}
        </span>
    </button>
);

// ─────────────────────────────────────────────
// Botón + Agregar — central pill premium
// ─────────────────────────────────────────────
const AddTab = ({ onPress }) => (
    <button
        onClick={onPress}
        className="relative flex flex-col items-center justify-center flex-1 h-full gap-1 outline-none select-none"
        aria-label="Agregar"
    >
        <motion.div
            className={cn(
                "relative z-10 w-11 h-11 rounded-2xl",
                "bg-primary text-primary-foreground",
                "flex items-center justify-center",
                "shadow-[0_4px_20px_hsl(var(--primary)/0.5)]",
            )}
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 600, damping: 30 }}
        >
            <Plus size={22} strokeWidth={2.5} />
        </motion.div>
        <span className="relative z-10 text-[10px] font-bold leading-none tracking-[-0.01em] text-muted-foreground/50">
            Agregar
        </span>
    </button>
);

// ─────────────────────────────────────────────
// Item del sheet "Más" — grid style
// ─────────────────────────────────────────────
const MoreGridItem = ({ to, icon: Icon, label, color, bgColor, onClose }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            onClick={onClose}
            className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-2xl",
                "transition-all duration-150 active:scale-[0.94]",
                isActive
                    ? "bg-primary/10 border border-primary/20"
                    : "bg-foreground/[0.035] dark:bg-white/[0.04] border border-transparent hover:border-border/40"
            )}
        >
            <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                bgColor
            )}>
                <Icon size={22} className={color} strokeWidth={1.8} />
            </div>
            <span className={cn(
                "text-[12px] font-bold text-center leading-tight",
                isActive ? "text-primary" : "text-foreground/80"
            )}>
                {label}
            </span>
            {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            )}
        </Link>
    );
};

// ─────────────────────────────────────────────
// Item de acción rápida
// ─────────────────────────────────────────────
const QuickActionItem = ({ icon: Icon, label, color, bgColor, onClick }) => (
    <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.93 }}
        className={cn(
            "flex flex-col items-center gap-3 p-5 rounded-2xl",
            "bg-foreground/[0.04] dark:bg-white/[0.04]",
            "border border-border/30 dark:border-white/[0.06]",
            "active:bg-foreground/8 transition-all duration-150"
        )}
    >
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", bgColor)}>
            <Icon size={26} className={color} strokeWidth={1.8} />
        </div>
        <span className="text-[13px] font-bold text-center leading-tight text-foreground">
            {label}
        </span>
    </motion.button>
);

// ─────────────────────────────────────────────
// Componente principal MobileNav
// ─────────────────────────────────────────────
export const MobileNav = () => {
    const { t } = useTranslation();
    const { addAccount, addGoal, addCategory } = useFinance();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
    const [activeAction, setActiveAction] = useState('transaction');

    // Long press para el botón +
    const longPressTimer = useRef(null);

    const handleAddPress = () => {
        triggerHaptic('light');
        setActiveAction('transaction');
        setIsAddOpen(true);
    };

    const handleLongPress = () => {
        triggerHaptic('heavy');
        setIsQuickMenuOpen(true);
    };

    const handleAddTouchStart = () => {
        longPressTimer.current = setTimeout(handleLongPress, 480);
    };

    const handleAddTouchEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
            if (!isQuickMenuOpen) {
                handleAddPress();
            }
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

    // Secciones del menú "Más"
    const moreSections = [
        {
            label: 'Finanzas',
            items: [
                { to: '/budget',        icon: PieChart,         label: t('common.budget'),        bgColor: 'bg-violet-500/12', color: 'text-violet-500' },
                { to: '/goals',         icon: Target,           label: t('common.goals'),         bgColor: 'bg-pink-500/12',   color: 'text-pink-500' },
                { to: '/subscriptions', icon: Zap,              label: t('common.subscriptions'), bgColor: 'bg-amber-500/12',  color: 'text-amber-500' },
                { to: '/accounts',      icon: CreditCard,       label: t('common.accounts') || 'Cuentas', bgColor: 'bg-blue-500/12', color: 'text-blue-500' },
            ]
        },
        {
            label: 'Herramientas',
            items: [
                { to: '/market',    icon: CandlestickChart, label: t('common.market'),    bgColor: 'bg-emerald-500/12', color: 'text-emerald-500' },
                { to: '/calendar',  icon: CalendarClock,    label: t('common.calendar') || 'Calendario', bgColor: 'bg-sky-500/12', color: 'text-sky-500' },
                { to: '/notes',     icon: BookOpen,         label: t('common.notes') || 'Notas', bgColor: 'bg-indigo-500/12', color: 'text-indigo-500' },
                { to: '/scheduled', icon: CalendarClock,    label: t('common.scheduled'), bgColor: 'bg-teal-500/12',    color: 'text-teal-500' },
            ]
        },
        {
            label: 'Sistema',
            items: [
                { to: '/categories', icon: Tags,     label: t('common.categories'), bgColor: 'bg-orange-500/12', color: 'text-orange-500' },
                { to: '/import',     icon: Upload,   label: t('common.import'),     bgColor: 'bg-slate-500/12',  color: 'text-muted-foreground' },
                { to: '/settings',   icon: Settings, label: t('common.settings'),   bgColor: 'bg-slate-500/12',  color: 'text-muted-foreground' },
            ]
        }
    ];

    const { title: formTitle, form: formComponent } = getFormContent();

    return (
        <>
            {/* ── Tab Bar Principal — Revolut Style ── */}
            <nav className={cn(
                "md:hidden fixed bottom-0 left-0 right-0 z-50",
                "bg-background/95 dark:bg-[hsl(240_12%_7%/0.97)] backdrop-blur-2xl",
                "border-t border-border/40 dark:border-white/[0.05]",
                "shadow-[0_-1px_0_rgba(0,0,0,0.04)]",
                "dark:shadow-[0_-1px_0_rgba(255,255,255,0.04)]",
                "flex items-stretch",
                "h-[4.25rem] pb-safe"
            )}>
                {/* Tab 1: Dashboard */}
                <NavTab
                    to="/"
                    icon={LayoutDashboard}
                    label={t('common.nav.home')}
                    exact
                />

                {/* Tab 2: Transacciones */}
                <NavTab
                    to="/transactions"
                    icon={Receipt}
                    label={t('common.nav.movs')}
                />

                {/* Tab 3: Botón Agregar */}
                <div
                    className="relative flex flex-col items-center justify-center flex-1 h-full gap-1 select-none"
                    onTouchStart={handleAddTouchStart}
                    onTouchEnd={handleAddTouchEnd}
                    onMouseDown={handleAddTouchStart}
                    onMouseUp={handleAddTouchEnd}
                    onMouseLeave={() => {
                        if (longPressTimer.current) {
                            clearTimeout(longPressTimer.current);
                            longPressTimer.current = null;
                        }
                    }}
                >
                    <AddTab onPress={handleAddPress} />
                </div>

                {/* Tab 4: Analytics */}
                <NavTab
                    to="/analytics"
                    icon={BarChart3}
                    label={t('common.analytics')}
                />

                {/* Tab 5: Más */}
                <Sheet open={isMoreOpen} onOpenChange={setIsMoreOpen}>
                    <SheetTrigger asChild>
                        <div className="flex-1 h-full">
                            <MoreTab
                                isActive={isMoreOpen}
                                onPress={() => setIsMoreOpen(true)}
                                label={t('common.nav.more')}
                            />
                        </div>
                    </SheetTrigger>

                    {/* Sheet "Más" — Premium Redesign */}
                    <SheetContent
                        side="bottom"
                        className={cn(
                            "rounded-t-[1.75rem] p-0",
                            "max-h-[88dvh] overflow-y-auto",
                            "bg-background dark:bg-[hsl(240_12%_7%)]",
                            "border-t border-border/30 dark:border-white/[0.07]"
                        )}
                    >
                        {/* Handle */}
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-9 h-1 rounded-full bg-foreground/12 dark:bg-white/12" />
                        </div>

                        <SheetHeader className="px-5 pt-3 pb-4">
                            <div className="flex items-center justify-between">
                                <SheetTitle className="text-[20px] font-black tracking-[-0.03em]">
                                    {t('common.nav.menu') || 'Menú'}
                                </SheetTitle>
                                <button
                                    onClick={() => setIsMoreOpen(false)}
                                    className="w-8 h-8 rounded-full bg-foreground/6 dark:bg-white/8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X size={15} strokeWidth={2.5} />
                                </button>
                            </div>
                        </SheetHeader>

                        <div className="px-4 pb-8 space-y-5">
                            {moreSections.map((section) => (
                                <div key={section.label}>
                                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/45 px-1 mb-2.5">
                                        {section.label}
                                    </p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {section.items.map((item) => (
                                            <MoreGridItem
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
                <SheetContent
                    side="bottom"
                    className={cn(
                        "rounded-t-[1.75rem] p-0",
                        "bg-background dark:bg-[hsl(240_12%_7%)]",
                        "border-t border-border/30 dark:border-white/[0.07]"
                    )}
                >
                    <div className="flex justify-center pt-3 pb-1">
                        <div className="w-9 h-1 rounded-full bg-foreground/12" />
                    </div>
                    <SheetHeader className="px-5 pt-3 pb-4">
                        <div className="flex items-center justify-between">
                            <SheetTitle className="text-[20px] font-black tracking-[-0.03em]">
                                {t('common.quick_actions.title')}
                            </SheetTitle>
                            <button
                                onClick={() => setIsQuickMenuOpen(false)}
                                className="w-8 h-8 rounded-full bg-foreground/6 flex items-center justify-center text-muted-foreground"
                            >
                                <X size={15} strokeWidth={2.5} />
                            </button>
                        </div>
                    </SheetHeader>

                    <div className="grid grid-cols-2 gap-3 px-5 pb-8">
                        <QuickActionItem
                            icon={Receipt}
                            label={t('common.quick_actions.new_transaction')}
                            bgColor="bg-blue-500/10"
                            color="text-blue-500"
                            onClick={() => handleActionClick('transaction')}
                        />
                        <QuickActionItem
                            icon={Landmark}
                            label={t('common.quick_actions.new_account')}
                            bgColor="bg-emerald-500/10"
                            color="text-emerald-500"
                            onClick={() => handleActionClick('account')}
                        />
                        <QuickActionItem
                            icon={Target}
                            label={t('common.quick_actions.new_goal')}
                            bgColor="bg-violet-500/10"
                            color="text-violet-500"
                            onClick={() => handleActionClick('goal')}
                        />
                        <QuickActionItem
                            icon={Tags}
                            label={t('common.quick_actions.new_category')}
                            bgColor="bg-amber-500/10"
                            color="text-amber-500"
                            onClick={() => handleActionClick('category')}
                        />
                    </div>
                </SheetContent>
            </Sheet>

            {/* ── Form Dialog ── */}
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
