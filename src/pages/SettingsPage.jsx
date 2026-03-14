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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-20 md:pb-0 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h2>

            {/* Profile Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {t('settings.profile')}
                    </CardTitle>
                    <CardDescription>{t('settings.profile_desc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
                <CardFooter className="justify-end">
                    <Button onClick={handleSave} className="gap-2">
                        <Save size={16} /> {t('settings.save_changes_btn')}
                    </Button>
                </CardFooter>
            </Card>

            {/* Preferences Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        {t('settings.appearance')}
                    </CardTitle>
                    <CardDescription>{t('settings.appearance_desc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
            </Card>

            {/* Language Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Languages className="h-5 w-5" />
                        {t('settings.language')}
                    </CardTitle>
                    <CardDescription>{t('settings.select_language')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>{t('settings.language')}</Label>
                        <select
                            value={i18n.language}
                            onChange={e => i18n.changeLanguage(e.target.value)}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                            <option value="es">Español 🇪🇸</option>
                            <option value="en">English 🇺🇸</option>
                            <option value="pt">Português 🇧🇷</option>
                            <option value="fr">Français 🇫🇷</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Data Management Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Download className="h-5 w-5" />
                        {t('settings.data')}
                    </CardTitle>
                    <CardDescription>{t('settings.data_desc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4">
                        <Button variant="outline" className="flex-1 gap-2 h-12" onClick={handleExport}>
                            <Download size={18} />
                            {t('settings.export_btn')}
                        </Button>
                        <Button variant="outline" className="flex-1 gap-2 h-12" onClick={() => fileInputRef.current?.click()}>
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
                </CardContent>
            </Card>

            {/* Gamification Settings */}
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card to-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sword className="h-5 w-5 text-primary" />
                        {t('settings.spirit_title')}
                    </CardTitle>
                    <CardDescription>{t('settings.spirit_desc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-white/5">
                        <div className="space-y-0.5">
                            <Label className="text-base">{t('settings.spirit_enable')}</Label>
                            <p className="text-sm text-muted-foreground">{t('dashboard.gamification_desc')}</p>
                        </div>
                        <Button
                            variant={isEnabled ? "default" : "outline"}
                            size="sm"
                            onClick={() => setIsEnabled(!isEnabled)}
                            className="rounded-full px-6 transition-all"
                        >
                            {isEnabled ? t('settings.spirit_on') : t('settings.spirit_off')}
                        </Button>
                    </div>

                    {isEnabled && (
                        <div className="pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2">
                            <Label className="text-sm mb-3 block">{t('settings.spirit_pet_label')}</Label>
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                {PET_OPTIONS.map(pet => (
                                    <button
                                        key={pet.id}
                                        onClick={() => {
                                            setSelectedPet(pet.id);
                                            toast.success(t('settings.spirit_change_success', { name: pet.name }));
                                        }}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all hover:scale-105 active:scale-95",
                                            selectedPet === pet.id
                                                ? "border-primary bg-primary/10 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                                                : "border-transparent bg-background/50 grayscale opacity-60 hover:opacity-100 hover:grayscale-0"
                                        )}
                                    >
                                        <span className="text-2xl mb-1">{pet.emoji}</span>
                                        <span className="text-[8px] font-bold uppercase truncate w-full text-center">{pet.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

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
