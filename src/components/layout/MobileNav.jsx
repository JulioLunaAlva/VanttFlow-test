import React, { useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Receipt, CreditCard, Menu, Plus, Zap, BarChart3, Target, CalendarClock, Upload, Tags, PieChart, Settings, CandlestickChart, Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { motion } from 'framer-motion';
import { triggerHaptic } from '@/utils/haptic';
import { useTranslation } from 'react-i18next';

export const MobileNav = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);

    const menuSections = [
        {
            title: t('common.tools'),
            icon: Sparkles,
            items: [
                { to: "/analytics", icon: BarChart3, label: t('common.analytics'), color: "blue" },
                { to: "/market", icon: CandlestickChart, label: t('common.market'), color: "emerald" },
                { to: "/subscriptions", icon: Zap, label: t('common.subscriptions'), color: "orange" },
                { to: "/budget", icon: PieChart, label: t('common.budget'), color: "purple" },
                { to: "/goals", icon: Target, label: t('common.goals'), color: "pink" },
            ]
        },
        {
            title: t('common.system'),
            icon: Settings,
            items: [
                { to: "/scheduled", icon: CalendarClock, label: t('common.scheduled'), color: "emerald" },
                { to: "/import", icon: Upload, label: t('common.import'), color: "indigo" },
                { to: "/categories", icon: Tags, label: t('common.categories'), color: "amber" },
            ]
        }
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-background/95 backdrop-blur border-t flex items-center justify-between px-6 z-50 pb-safe">
            {/* Left Side */}
            <NavLink
                to="/"
                className={({ isActive }) => cn(
                    "flex flex-col items-center justify-center w-14 h-full transition-colors",
                    isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
                )}
            >
                {({ isActive }) => (
                    <>
                        <LayoutDashboard size={28} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[11px] mt-1 font-bold">{t('common.nav.home')}</span>
                    </>
                )}
            </NavLink>

            <NavLink
                to="/transactions"
                className={({ isActive }) => cn(
                    "flex flex-col items-center justify-center w-14 h-full transition-colors",
                    isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
                )}
            >
                {({ isActive }) => (
                    <>
                        <Receipt size={28} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[11px] mt-1 font-bold">{t('common.nav.movs')}</span>
                    </>
                )}
            </NavLink>

            {/* Center Action Button */}
            <div id="tour-add" className="relative -top-6">
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button
                            size="icon"
                            className="h-16 w-16 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] bg-primary text-primary-foreground hover:bg-primary/90 border-4 border-background active:scale-95 transition-transform"
                            onClick={() => triggerHaptic('medium')}
                        >
                            <Plus size={36} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="p-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-bold mb-4">Nueva Transacción</h2>
                        <TransactionForm onSuccess={() => setIsAddOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Right Side */}
            <NavLink
                to="/cards"
                className={({ isActive }) => cn(
                    "flex flex-col items-center justify-center w-14 h-full transition-colors",
                    isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
                )}
            >
                {({ isActive }) => (
                    <>
                        <CreditCard size={28} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[11px] mt-1 font-bold">{t('common.nav.cards')}</span>
                    </>
                )}
            </NavLink>

            {/* More Menu - Bottom Sheet */}
            <Sheet open={isMoreOpen} onOpenChange={setIsMoreOpen}>
                <SheetTrigger asChild>
                    <button
                        className={cn(
                            "flex flex-col items-center justify-center w-14 h-full transition-colors outline-none",
                            isMoreOpen ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Menu size={28} strokeWidth={isMoreOpen ? 2.5 : 2} />
                        <span className="text-[11px] mt-1 font-bold">{t('common.nav.more')}</span>
                    </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="border-border/50">
                    {/* Drag indicator */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-muted-foreground/30 rounded-full" />

                    <SheetHeader className="mb-6 mt-4">
                        <SheetTitle className="text-2xl font-black tracking-tight">{t('common.nav.menu')}</SheetTitle>
                        <p className="text-sm text-muted-foreground">Accede a todas las herramientas de VanttFlow</p>
                    </SheetHeader>

                    <div className="space-y-6 pb-8">
                        {menuSections.map((section, sectionIndex) => (
                            <motion.div
                                key={section.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: sectionIndex * 0.1 }}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <section.icon className="w-4 h-4 text-primary" />
                                    <h3 className="text-xs font-black uppercase tracking-wider text-foreground/60">
                                        {section.title}
                                    </h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {section.items.map((item, itemIndex) => {
                                        const Icon = item.icon;
                                        const isActive = location.pathname === item.to;
                                        return (
                                            <motion.div
                                                key={item.to}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                                            >
                                                <Link
                                                    to={item.to}
                                                    onClick={() => setIsMoreOpen(false)}
                                                    className={cn(
                                                        "flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 active:scale-95",
                                                        isActive
                                                            ? "bg-primary/10 border-2 border-primary/30 shadow-lg"
                                                            : "bg-muted/30 hover:bg-muted/50 border-2 border-transparent"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300",
                                                        isActive ? "scale-110" : "group-hover:scale-105",
                                                        `bg-${item.color}-500/10`
                                                    )}>
                                                        <Icon className={cn(
                                                            "w-6 h-6",
                                                            `text-${item.color}-500`
                                                        )} />
                                                    </div>
                                                    <span className="text-xs font-bold text-center leading-tight">
                                                        {item.label}
                                                    </span>
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ))}

                        {/* Settings - Special Item */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Link
                                to="/settings"
                                onClick={() => setIsMoreOpen(false)}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-muted/30 to-muted/50 hover:from-muted/50 hover:to-muted/70 transition-all duration-300 active:scale-95 border-2 border-border/50"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-slate-500/10 flex items-center justify-center">
                                    <Settings className="w-6 h-6 text-slate-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold">{t('common.settings')}</p>
                                    <p className="text-xs text-muted-foreground">Personaliza tu experiencia</p>
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};
