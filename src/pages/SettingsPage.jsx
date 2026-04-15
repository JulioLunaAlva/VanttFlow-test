import React, { useState } from 'react';
import { useIdentity } from '@/context/IdentityContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select } from "@/components/ui/select";

import { User, Mail, Lock, LogOut, Trash2, Save, Globe, Sparkles, Sword, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useGamification } from '@/context/GamificationContext';
import { useFinance } from '@/context/FinanceContext';
import { useNotifications } from '@/context/NotificationContext';
import { Download, Upload, Bell, Zap } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

export const SettingsPage = () => {
    const { user, updateProfile, logout, autoLockMinutes, setAutoLockMinutes } = useIdentity();
    const { isEnabled, setIsEnabled, selectedPet, setSelectedPet } = useGamification();
    const { state: financeState, dispatch } = useFinance(); // Get access to finance state
    const { permission, requestPermission, sendNotification, triggerMotivation } = useNotifications();
    const { t, i18n } = useTranslation();
    const fileInputRef = useRef(null);

    const PET_OPTIONS = [
        { id: 'fox', emoji: '🦊', name: 'Zorro' },
        { id: 'dog', emoji: '🐶', name: 'Perro' },
        { id: 'shinobi', emoji: '🥷', name: 'Shinobi' },
        { id: 'chief', emoji: '🛡️', name: 'Spartan' },
        { id: 'kitty', emoji: '🐱', name: 'Gatito' },
        { id: 'pocket', emoji: '⚡', name: 'Pocket' },
        { id: 'maiden', emoji: '👸', name: 'Dama' }
    ];

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        pin: user?.pin || '',
        currency: user?.currency || 'MXN'
    });

    const handleSave = async () => {
        if (!formData.name) return toast.error('El nombre es requerido');
        if (formData.pin.length < 4) return toast.error('El PIN debe tener 4 dígitos');

        await updateProfile({
            name: formData.name,
            email: formData.email,
            pin: formData.pin,
            currency: formData.currency
        });
    };

    const handleResetData = () => {
        if (confirm('¿ESTÁS SEGURO? Esto borrará TODAS tus transacciones, cuentas y metas. Esta acción no se puede deshacer.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const handleExport = () => {
        const data = {
            version: '1.2',
            exportedAt: new Date().toISOString(),
            // Finance Keys
            transactions: JSON.parse(localStorage.getItem('finance_transactions') || '[]'),
            categories: JSON.parse(localStorage.getItem('finance_categories') || '[]'),
            accounts: JSON.parse(localStorage.getItem('finance_accounts') || '[]'),
            scheduledPayments: JSON.parse(localStorage.getItem('finance_scheduled') || '[]'),
            paymentInstances: JSON.parse(localStorage.getItem('finance_scheduled_instances') || '[]'),
            budgets: JSON.parse(localStorage.getItem('finance_budgets') || '[]'),
            goals: JSON.parse(localStorage.getItem('finance_goals') || '[]'),
            // Identity Keys
            identity: JSON.parse(localStorage.getItem('vantt_identity')),
            privacyMode: JSON.parse(localStorage.getItem('vantt_privacy_mode') || 'false'),
            // Gamification Keys
            gamification: {
                enabled: JSON.parse(localStorage.getItem('gamification_enabled') || 'true'),
                pet: JSON.parse(localStorage.getItem('gamification_selected_pet') || '"fox"'),
                xp: JSON.parse(localStorage.getItem('gamification_xp') || '0'),
                achievements: JSON.parse(localStorage.getItem('gamification_achievements') || '[]'),
                lastLogin: JSON.parse(localStorage.getItem('gamification_last_login')),
                streak: JSON.parse(localStorage.getItem('gamification_streak') || '0'),
                missions: JSON.parse(localStorage.getItem('gamification_daily_missions') || '[]'),
                missionsDate: JSON.parse(localStorage.getItem('gamification_missions_date'))
            },
            // Market
            market: JSON.parse(localStorage.getItem('market_data_real'))
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vanttflow_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(t('settings.export_success'));
    };

    const validateBackupData = (data) => {
        if (!data || typeof data !== 'object') return false;
        // Check for required root structure
        const requiredKeys = ['identity', 'transactions', 'categories', 'accounts'];
        if (!requiredKeys.every(key => Object.prototype.hasOwnProperty.call(data, key))) return false;
        if (!data.identity.name || !data.identity.pin) return false;
        if (!Array.isArray(data.transactions)) return false;
        if (!Array.isArray(data.categories)) return false;
        if (!Array.isArray(data.accounts)) return false;
        return true;
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);

                if (!validateBackupData(data)) {
                    toast.error(t('settings.import_invalid_format') || 'Formato de archivo inválido o corrupto');
                    return;
                }

                if (confirm(t('settings.import_confirm'))) {
                    // Start atomic-like update by verifying keys first
                    const backupKeys = {
                        'finance_transactions': data.transactions,
                        'finance_categories': data.categories,
                        'finance_accounts': data.accounts,
                        'finance_scheduled': data.scheduledPayments || [],
                        'finance_scheduled_instances': data.paymentInstances || [],
                        'finance_budgets': data.budgets || [],
                        'finance_goals': data.goals || [],
                        'market_data_real': data.market || null,
                        'vantt_identity': data.identity,
                        'vantt_privacy_mode': data.privacyMode ?? false
                    };

                    // Gamification
                    if (data.gamification) {
                        backupKeys['gamification_enabled'] = data.gamification.enabled ?? true;
                        backupKeys['gamification_selected_pet'] = data.gamification.pet || "fox";
                        backupKeys['gamification_xp'] = data.gamification.xp || 0;
                        backupKeys['gamification_achievements'] = data.gamification.achievements || [];
                        backupKeys['gamification_last_login'] = data.gamification.lastLogin;
                        backupKeys['gamification_streak'] = data.gamification.streak || 0;
                        backupKeys['gamification_daily_missions'] = data.gamification.missions || [];
                        backupKeys['gamification_missions_date'] = data.gamification.missionsDate;
                    }

                    // Apply all to localStorage
                    Object.entries(backupKeys).forEach(([key, value]) => {
                        if (value !== null && value !== undefined) {
                            localStorage.setItem(key, JSON.stringify(value));
                        }
                    });

                    toast.success(t('settings.import_success'));
                    setTimeout(() => window.location.reload(), 1500);
                }
            } catch (error) {
                console.error('Import error:', error);
                toast.error(t('settings.import_error'));
            }
        };
        reader.readAsText(file);
        e.target.value = null;
    };

    return (
        <div className="space-y-8 pb-32 md:pb-8 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between glass-card p-6 border-white/10 mb-2">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter text-foreground">
                        {t('settings.title')}
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 mt-1">
                        Configuración y Personalización
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="glass-premium px-4 py-2 rounded-2xl border-white/10 text-primary font-black text-[10px] tracking-widest uppercase">
                        V1.2 BETA
                    </div>
                </div>
            </div>

            {/* Profile Section */}
            <div className="glass-card card-glow border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <User size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tighter">{t('settings.profile')}</h3>
                            <p className="text-xs text-muted-foreground/60">{t('settings.profile_desc')}</p>
                        </div>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">{t('settings.name_label')}</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="name"
                                className="pl-9"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">{t('settings.email_label')}</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                className="pl-9"
                                placeholder={t('settings.email_placeholder')}
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="pin">{t('settings.pin_label_setting')}</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="pin"
                                type="password"
                                className="pl-9 font-mono tracking-widest"
                                maxLength={4}
                                value={formData.pin}
                                onChange={e => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                            />
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-white/5 border-t border-white/5 flex justify-end">
                    <Button onClick={handleSave} className="shadow-2xl gap-2 rounded-2xl h-12 font-black px-8 group transition-all duration-500 scale-100 hover:scale-105 active:scale-95 shadow-primary/20">
                        <Save size={18} /> {t('settings.save_changes_btn')}
                    </Button>
                </div>
            </div>

            {/* Preferences Section */}
            <div className="glass-card border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Globe size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tighter">{t('settings.appearance')}</h3>
                            <p className="text-xs text-muted-foreground/60">{t('settings.appearance_desc')}</p>
                        </div>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid gap-2">
                        <Label>{t('settings.currency_label')}</Label>
                        <select
                            value={formData.currency}
                            onChange={e => setFormData({ ...formData, currency: e.target.value })}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                        >
                            <option value="MXN">Peso Mexicano (MXN)</option>
                            <option value="USD">Dólar Americano (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                            <option value="COP">Peso Colombiano (COP)</option>
                        </select>
                        <p className="text-xs text-muted-foreground">
                            {t('settings.currency_note')}
                        </p>
                    </div>
                    <Separator />

                    <div className="pt-2">
                        <Label>{t('settings.tour_label')}</Label>
                        <div className="mt-2 text-center p-6 border-2 border-dashed rounded-xl bg-muted/20">
                            <Sparkles className="w-8 h-8 text-primary mx-auto mb-2 opacity-50" />
                            <p className="text-sm text-muted-foreground mb-4">{t('settings.tour_desc')}</p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    localStorage.removeItem('vanttflow_tour_completed');
                                    toast.success(t('settings.tour_success'));
                                }}
                            >
                                {t('settings.tour_restart')}
                            </Button>
                        </div>
                    </div>
                </CardContent>
                </div>
            </div>

            {/* Language Settings */}
            <div className="glass-card border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <Languages size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tighter">{t('settings.language')}</h3>
                            <p className="text-xs text-muted-foreground/60">{t('settings.select_language')}</p>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="grid gap-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-1">{t('settings.language')}</Label>
                        <select
                            value={i18n.language}
                            onChange={e => i18n.changeLanguage(e.target.value)}
                            className="flex h-12 w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                        >
                            <option value="es">Español 🇪🇸</option>
                            <option value="en">English 🇺🇸</option>
                            <option value="pt">Português 🇧🇷</option>
                            <option value="fr">Français 🇫🇷</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Data Management Section */}
            <div className="glass-card border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                            <Download size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tighter">{t('settings.data')}</h3>
                            <p className="text-xs text-muted-foreground/60">{t('settings.data_desc')}</p>
                        </div>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button variant="outline" className="flex-1 gap-2 h-14 rounded-2xl border-white/10 hover:bg-white/5 font-black uppercase text-[10px] tracking-widest" onClick={handleExport}>
                            <Download size={18} />
                            {t('settings.export_btn')}
                        </Button>
                        <Button variant="outline" className="flex-1 gap-2 h-14 rounded-2xl border-white/10 hover:bg-white/5 font-black uppercase text-[10px] tracking-widest" onClick={() => fileInputRef.current?.click()}>
                            <Upload size={18} />
                            {t('settings.import_btn')}
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImport}
                            className="hidden"
                            accept=".json"
                        />
                    </div>
                </div>
            </div>

            {/* Gamification Settings */}
            <div className="glass-card card-glow border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary animate-pulse-slow">
                            <Sword size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tighter text-primary">{t('settings.spirit_title')}</h3>
                            <p className="text-xs text-muted-foreground/60">{t('settings.spirit_desc')}</p>
                        </div>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between p-5 rounded-2xl glass-premium border-white/10">
                        <div className="space-y-1">
                            <Label className="text-base font-black tracking-tight">{t('settings.spirit_enable')}</Label>
                            <p className="text-xs text-muted-foreground/60">{t('dashboard.gamification_desc')}</p>
                        </div>
                        <Button
                            variant={isEnabled ? "default" : "outline"}
                            size="sm"
                            onClick={() => setIsEnabled(!isEnabled)}
                            className={cn(
                                "rounded-full px-8 h-10 font-black tracking-widest text-[9px] uppercase transition-all duration-500",
                                isEnabled ? "shadow-lg shadow-primary/20" : "border-white/10"
                            )}
                        >
                            {isEnabled ? t('settings.spirit_on') : t('settings.spirit_off')}
                        </Button>
                    </div>

                    {isEnabled && (
                        <div className="pt-6 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-700">
                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-4 block px-1">{t('settings.spirit_pet_label')}</Label>
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                                {PET_OPTIONS.map(pet => (
                                    <button
                                        key={pet.id}
                                        onClick={() => {
                                            setSelectedPet(pet.id);
                                            toast.success(t('settings.spirit_change_success', { name: pet.name }));
                                        }}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-500 hover:scale-110 active:scale-90",
                                            selectedPet === pet.id
                                                ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-105"
                                                : "border-transparent glass-card grayscale opacity-40 hover:opacity-100 hover:grayscale-0"
                                        )}
                                    >
                                        <span className="text-3xl mb-1.5">{pet.emoji}</span>
                                        <span className="text-[7px] font-black uppercase truncate w-full text-center tracking-tighter">{pet.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Notification Settings (PWA) */}
            <Card className="border-indigo-500/20 bg-indigo-50/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-indigo-500" />
                        {t('settings.notifications')}
                    </CardTitle>
                    <CardDescription>{t('settings.notifications_desc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-white/5">
                        <div className="space-y-0.5">
                            <Label className="text-base text-indigo-600 dark:text-indigo-400">
                                {t('settings.notif_status')}: {permission === 'granted' ? t('settings.notif_status_on') : permission === 'denied' ? t('settings.notif_status_blocked') : t('settings.notif_status_off')}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                {permission === 'granted'
                                    ? t('settings.notif_on_desc')
                                    : t('settings.notif_off_desc')}
                            </p>
                        </div>
                        {permission !== 'granted' ? (
                            <Button size="sm" onClick={requestPermission}>
                                {t('settings.notif_activate_btn')}
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => sendNotification("Test", "The notification system works!")}>
                                    {t('settings.notif_test_btn')}
                                </Button>
                                <Button variant="ghost" size="icon" onClick={triggerMotivation} title="Surprise Message">
                                    <Zap size={16} className="text-yellow-500" />
                                </Button>
                            </div>
                        )}
                    </div>
                    <p className="text-[10px] text-muted-foreground italic">
                        {t('settings.notif_ios_note')}
                    </p>
                </CardContent>
            </Card>

            {/* Session & Danger Zone */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-red-200 dark:border-red-900/50">
                    <CardHeader>
                        <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                            <Trash2 className="h-5 w-5" />
                            {t('settings.danger_title')}
                        </CardTitle>
                        <CardDescription>{t('settings.danger_desc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="destructive" className="w-full" onClick={handleResetData}>
                            {t('settings.danger_btn')}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LogOut className="h-5 w-5" />
                            {t('settings.session_title')}
                        </CardTitle>
                        <CardDescription>{t('settings.session_desc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2"><Timer size={14} /> {t('settings.autolock_label')}</Label>
                            <select
                                value={autoLockMinutes}
                                onChange={e => setAutoLockMinutes(Number(e.target.value))}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                                <option value={0}>{t('settings.autolock_never')}</option>
                                <option value={1}>{t('settings.autolock_min')}</option>
                                <option value={2}>{t('settings.autolock_mins', { count: 2 })}</option>
                                <option value={5}>{t('settings.autolock_mins', { count: 5 })}</option>
                                <option value={15}>{t('settings.autolock_mins', { count: 15 })}</option>
                                <option value={30}>{t('settings.autolock_mins', { count: 30 })}</option>
                            </select>
                        </div>
                        <Separator />
                        <Button variant="outline" className="w-full" onClick={logout}>
                            {t('settings.logout_btn')}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="text-center text-xs text-muted-foreground pt-8">
                VanttFlow v1.2 Beta • Build 2026
            </div>
        </div>
    );
};
