import React from 'react';
import { LayoutDashboard, Receipt, Wallet, CalendarClock, PieChart, Target, Download, BarChart3, Tags, CreditCard, Zap, Upload, Settings, CandlestickChart, Eye, EyeOff, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { NavLink, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MonthSelector } from './MonthSelector';
import { ModeToggle } from "@/components/ui/ModeToggle";
import { useFinance } from "@/context/FinanceContext";
import { useIdentity } from "@/context/IdentityContext";
import { useTranslation } from 'react-i18next';
import { LevelProgress } from '@/components/gamification/LevelProgress';
import { SpiritPet } from '@/components/gamification/SpiritPet';
import { MobileNav } from './MobileNav';
import { AppTour } from '@/components/onboarding/AppTour';

// Route label map
const ROUTE_LABELS = {
    '/': { title: 'dashboard.title', subtitle: 'dashboard.subtitle' },
    '/transactions': { title: 'common.transactions', subtitle: 'transactions.manage_desc' },
    '/analytics': { title: 'common.analytics', subtitle: null },
    '/market': { title: 'common.market', subtitle: null },
    '/budget': { title: 'common.budget', subtitle: null },
    '/goals': { title: 'common.goals', subtitle: null },
    '/calendar': { title: 'common.calendar', subtitle: null },
    '/notes': { title: 'common.notes', subtitle: null },
    '/scheduled': { title: 'common.scheduled', subtitle: null },
    '/accounts': { title: 'common.cards', subtitle: null },
    '/subscriptions': { title: 'common.subscriptions', subtitle: null },
    '/categories': { title: 'common.categories', subtitle: null },
    '/import': { title: 'common.import', subtitle: null },
    '/settings': { title: 'settings.title', subtitle: null },
    '/reports': { title: 'common.reports', subtitle: null },
};

// ── Sidebar Link Component ──
const SidebarLink = ({ to, icon: Icon, label, id }) => (
    <NavLink
        to={to}
        id={id}
        end={to === '/'}
        className={({ isActive }) => cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-semibold",
            "transition-all duration-200 relative group select-none",
            "tracking-[-0.01em]",
            isActive
                ? "text-primary bg-primary/10 dark:bg-primary/15"
                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
        )}
    >
        {({ isActive }) => (
            <>
                {/* Left indicator bar */}
                {isActive && (
                    <motion.div
                        layoutId="sidebar-indicator"
                        className="absolute -left-5 top-1/2 -translate-y-1/2 w-0.5 h-[55%] rounded-r-full bg-primary"
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                )}
                <Icon
                    size={17}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className="flex-shrink-0 transition-all duration-200"
                />
                <span>{label}</span>
            </>
        )}
    </NavLink>
);

// ── Sidebar Section Header ──
const SidebarSectionLabel = ({ children }) => (
    <p className="px-3 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/40 mb-1.5 mt-5 first:mt-0">
        {children}
    </p>
);

// ── Sidebar Component ──
const Sidebar = ({ className }) => {
    const { t } = useTranslation();
    const { user, privacyMode, setPrivacyMode } = useIdentity();
    const { exportData } = useFinance();

    return (
        <div className={cn(
            "w-[268px] h-full flex flex-col relative overflow-hidden",
            "border-r border-border/40 dark:border-white/[0.05]",
            "bg-background dark:bg-[hsl(240_15%_5%)]",
            className
        )}>
            {/* Logo Area */}
            <div className="px-7 pt-8 pb-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-xl opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
                        <img
                            src="/logo.png"
                            alt="VanttFlow"
                            className="w-9 h-9 rounded-xl relative z-10 shadow-md"
                        />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-[17px] font-black tracking-[-0.03em] text-foreground">VanttFlow</span>
                        <span className="text-[9px] font-black uppercase tracking-[0.28em] text-primary/50 mt-0.5">
                            Financial Spirit
                        </span>
                    </div>
                </Link>

                <div className="flex items-center gap-1">
                    <button
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all"
                        onClick={() => setPrivacyMode(!privacyMode)}
                        title={privacyMode ? "Mostrar valores" : "Ocultar valores"}
                    >
                        {privacyMode ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <ModeToggle id="tour-theme-toggle-desktop" />
                </div>
            </div>

            {/* User Card */}
            <div className="px-5 pb-5">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-foreground/[0.04] dark:bg-white/[0.04] border border-border/30 dark:border-white/[0.05]">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/25 to-blue-600/25 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-[11px] font-black text-primary uppercase">
                            {user?.name?.charAt(0) || 'V'}
                        </span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[12.5px] font-bold text-foreground truncate leading-tight">
                            {user?.name?.split(' ')[0] || t('common.welcome')}
                        </p>
                        <p className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] leading-tight mt-0.5">
                            Pro Member
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <LevelProgress variant="compact" className="w-20 hidden xl:flex" />
                    </div>
                </div>
            </div>

            {/* Gamification */}
            <div className="px-5 mb-5">
                <div className="p-4 rounded-xl bg-foreground/[0.03] dark:bg-white/[0.03] border border-border/30 dark:border-white/[0.05] group hover:border-primary/15 transition-all duration-400">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="relative flex-shrink-0">
                            <SpiritPet size="sm" showBubble={false} className="scale-90" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-muted-foreground/50">
                                Compañero
                            </span>
                            <span className="text-[12px] font-bold text-foreground leading-tight">
                                Activo
                            </span>
                        </div>
                    </div>
                    <LevelProgress />
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-5 overflow-y-auto">
                <SidebarSectionLabel>{t('common.main_menu')}</SidebarSectionLabel>
                <SidebarLink to="/" icon={LayoutDashboard} label={t('common.dashboard')} />
                <SidebarLink to="/transactions" icon={Receipt} label={t('common.transactions')} id="tour-transactions-nav" />
                <SidebarLink to="/analytics" icon={BarChart3} label={t('common.analytics')} />
                <SidebarLink to="/market" icon={CandlestickChart} label={t('common.market')} />

                <div className="my-4 border-t border-border/30 dark:border-white/[0.05]" />

                <SidebarSectionLabel>{t('common.tools')}</SidebarSectionLabel>
                <SidebarLink to="/budget" icon={PieChart} label={t('common.budget')} />
                <SidebarLink to="/goals" icon={Target} label={t('common.goals')} />
                <SidebarLink to="/calendar" icon={CalendarClock} label={t('common.calendar') || 'Calendario'} />
                <SidebarLink to="/notes" icon={BookOpen} label={t('common.notes') || 'Cuaderno'} />
                <SidebarLink to="/scheduled" icon={CalendarClock} label={t('common.scheduled')} />
                <SidebarLink to="/accounts" icon={CreditCard} label={t('common.cards') || 'Cuentas'} />
                <SidebarLink to="/subscriptions" icon={Zap} label={t('common.subscriptions')} />

                <div className="my-4 border-t border-border/30 dark:border-white/[0.05]" />

                <SidebarSectionLabel>{t('common.system')}</SidebarSectionLabel>
                <SidebarLink to="/categories" icon={Tags} label={t('common.categories')} />
                <SidebarLink to="/import" icon={Upload} label={t('common.import')} />
                <SidebarLink to="/settings" icon={Settings} label={t('common.settings')} />

                {/* Export */}
                <button
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 mt-3 rounded-xl",
                        "text-[13.5px] font-semibold text-muted-foreground hover:text-foreground",
                        "hover:bg-foreground/5 transition-all duration-200",
                        "tracking-[-0.01em]"
                    )}
                    onClick={exportData}
                >
                    <Download size={17} strokeWidth={1.8} className="flex-shrink-0" />
                    <span>{t('common.export_csv')}</span>
                </button>
            </nav>

            {/* Footer */}
            <div className="px-5 py-5 border-t border-border/30 dark:border-white/[0.05] flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground/30">
                    VanttFlow
                </span>
                <span className="text-[10px] font-bold text-primary/40 bg-primary/8 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Beta
                </span>
            </div>
        </div>
    );
};

// ── Privacy Toggle ──
const SidebarPrivacyToggle = () => {
    const { privacyMode, setPrivacyMode } = useIdentity();
    return (
        <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground hover:text-foreground w-8 h-8"
            onClick={() => setPrivacyMode(!privacyMode)}
        >
            {privacyMode ? <EyeOff size={16} /> : <Eye size={16} />}
        </Button>
    );
};

// ── Main Layout ──
export const Layout = ({ children }) => {
    const { t } = useTranslation();
    const location = useLocation();

    return (
        <div className="min-h-screen bg-background flex font-sans antialiased text-foreground">
            <AppTour />

            {/* Desktop Sidebar */}
            <Sidebar className="hidden xl:flex" />

            <div className="flex-1 flex flex-col pb-[5.5rem] xl:pb-0 min-w-0">

                {/* Mobile / Tablet Top Header */}
                <header className={cn(
                    "pt-safe sticky top-0 z-40",
                    "bg-background/90 backdrop-blur-2xl",
                    "border-b border-border/40 dark:border-white/[0.05]",
                    "px-4 xl:hidden"
                )}>
                    <div className="flex items-center justify-between h-14">
                        <Link to="/" className="flex items-center gap-2.5 active:opacity-70 transition-opacity">
                            <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-xl shadow-sm" />
                            <span className="font-black text-[17px] tracking-[-0.03em] text-foreground">
                                VanttFlow
                            </span>
                        </Link>

                        <div className="flex items-center gap-1">
                            <LevelProgress variant="compact" className="w-24 hidden xs:flex" />
                            <SidebarPrivacyToggle />
                            <ModeToggle id="tour-theme-toggle-mobile" />
                        </div>
                    </div>
                </header>

                {/* Desktop Topbar */}
                <div className={cn(
                    "hidden xl:flex h-[60px] px-10 items-center justify-between",
                    "border-b border-border/40 dark:border-white/[0.05]",
                    "bg-background/80 backdrop-blur-xl"
                )}>
                    <div className="flex flex-col">
                        <h2 className="text-[16px] font-black tracking-[-0.025em] text-foreground">
                            {t(ROUTE_LABELS[location.pathname]?.title || 'dashboard.title')}
                        </h2>
                        {ROUTE_LABELS[location.pathname]?.subtitle && (
                            <span className="text-[11px] font-semibold text-muted-foreground/60 mt-0.5 tracking-[0.01em]">
                                {t(ROUTE_LABELS[location.pathname].subtitle)}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <MonthSelector />
                    </div>
                </div>

                {/* Mobile Sub-header with page title */}
                <div className={cn(
                    "xl:hidden px-4 py-2.5",
                    "border-b border-border/30 dark:border-white/[0.04]",
                    "bg-background/60 backdrop-blur-md"
                )}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <h2 className="font-black text-[15px] tracking-[-0.025em] text-foreground">
                            {t(ROUTE_LABELS[location.pathname]?.title || 'dashboard.title')}
                        </h2>
                        <div className="flex items-center justify-start sm:justify-end">
                            <MonthSelector />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-auto overflow-x-hidden bg-background/50 scroll-smooth-mobile">
                    <div className="max-w-7xl mx-auto h-full min-w-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                                className="h-full min-w-0"
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>

                <MobileNav />
            </div>
        </div>
    );
};
