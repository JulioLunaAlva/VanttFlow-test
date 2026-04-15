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
    const { state: _financeState, dispatch: _dispatch } = useFinance(); // Removed unused as per lint, but keeping destructuring logic structure if needed later
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
        <div className="space-y-10 pb-32 md:pb-8 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between glass-premium p-10 rounded-[3rem] border-white/10 mb-4 group relative overflow-hidden active:scale-95 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="relative z-10">
                    <h2 className="text-5xl font-black tracking-tighter text-white drop-shadow-2xl">
                        {t('settings.title')}
                    </h2>
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary/60 mt-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary shadow-glow animate-pulse" />
                        Configuración y Personalización
                    </p>
                </div>
                <div className="flex items-center gap-3 mt-6 md:mt-0 relative z-10">
                    <div className="glass-premium px-6 py-3 rounded-2xl border-primary/20 text-primary font-black text-[10px] tracking-[0.3em] uppercase shadow-glow">
                        V1.2 BETA
                    </div>
                </div>
            </div>

            {/* Profile Section */}
            <div className="glass-premium rounded-[3rem] border-white/10 overflow-hidden group active:scale-[0.99] transition-all duration-500">
                <div className="p-8 border-b border-white/5">
                    <div className="flex items-center gap-5">
                        <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-glow group-hover:scale-110 transition-transform duration-500">
                            <User size={22} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tighter text-white drop-shadow-lg">{t('settings.profile')}</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{t('settings.profile_desc')}</p>
                        </div>
                    </div>
                </div>
                <div className="p-8 space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{t('settings.name_label')}</Label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 h-4 w-4 text-white/20" />
                            <Input
                                id="name"
                                className="pl-12 h-12 rounded-2xl bg-white/5 border-white/5 text-white font-black tracking-tight"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{t('settings.email_label')}</Label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 h-4 w-4 text-white/20" />
                            <Input
                                id="email"
                                type="email"
                                className="pl-12 h-12 rounded-2xl bg-white/5 border-white/5 text-white font-black tracking-tight"
                                placeholder={t('settings.email_placeholder')}
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="pin" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{t('settings.pin_label_setting')}</Label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 h-4 w-4 text-white/20" />
                            <Input
                                id="pin"
                                type="password"
                                className="pl-12 h-12 rounded-2xl bg-white/5 border-white/5 text-white font-mono tracking-[0.5em]"
                                maxLength={4}
                                value={formData.pin}
                                onChange={e => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                            />
                        </div>
                    </div>
                </div>
                <div className="p-8 bg-white/[0.02] border-t border-white/5 flex justify-end">
                    <Button onClick={handleSave} className="glass-premium border-white/20 hover:border-primary/50 bg-primary/10 hover:bg-primary/20 text-white shadow-2xl gap-3 rounded-2xl h-14 font-black px-10 hover:scale-105 active:scale-95 transition-all duration-500">
                        <Save size={18} /> {t('settings.save_changes_btn')}
                    </Button>
                </div>
            </div>

            {/* Preferences Section */}
            <div className="glass-premium rounded-[3rem] border-white/10 overflow-hidden">
                <div className="p-8 border-b border-white/5">
                    <div className="flex items-center gap-5">
                        <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 shadow-glow">
                            <Globe size={22} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tighter text-white drop-shadow-lg">{t('settings.appearance')}</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{t('settings.appearance_desc')}</p>
                        </div>
                    </div>
                </div>
                <div className="p-8 space-y-6">
                    <div className="grid gap-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{t('settings.currency_label')}</Label>
                        <select
                            value={formData.currency}
                            onChange={e => setFormData({ ...formData, currency: e.target.value })}
                            className="flex h-14 w-full items-center rounded-2xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-black tracking-tight text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer appearance-none"
                        >
                            <option value="MXN">Peso Mexicano (MXN)</option>
                            <option value="USD">Dólar Americano (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                            <option value="COP">Peso Colombiano (COP)</option>
                        </select>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] px-2">
                            {t('settings.currency_note')}
                        </p>
                    </div>
                    <div className="h-px bg-white/5" />

                    <div className="pt-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{t('settings.tour_label')}</Label>
                        <div className="mt-4 text-center p-10 border-2 border-dashed border-white/10 rounded-[2.5rem] glass-premium">
                            <Sparkles className="w-10 h-10 text-primary mx-auto mb-4 opacity-50 drop-shadow-glow" />
                            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-6">{t('settings.tour_desc')}</p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    localStorage.removeItem('vanttflow_tour_completed');
                                    toast.success(t('settings.tour_success'));
                                }}
                                className="glass-premium border-white/20 hover:border-primary/50 rounded-2xl h-12 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-white hover:bg-white/5"
                            >
                                {t('settings.tour_restart')}
                            </Button>
                        </div>
                    </div>
                    </div>
                </div>

            {/* Language Settings */}
            <div className="glass-premium rounded-[3rem] border-white/10 overflow-hidden">
                <div className="p-8 border-b border-white/5">
                    <div className="flex items-center gap-5">
                        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-glow">
                            <Languages size={22} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tighter text-white drop-shadow-lg">{t('settings.language')}</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{t('settings.select_language')}</p>
                        </div>
                    </div>
                </div>
                <div className="p-8">
                    <div className="grid gap-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 px-1">{t('settings.language')}</Label>
                        <select
                            value={i18n.language}
                            onChange={e => i18n.changeLanguage(e.target.value)}
                            className="flex h-14 w-full items-center rounded-2xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-black tracking-tight text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
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
            <div className="glass-premium rounded-[3rem] border-white/10 overflow-hidden">
                <div className="p-8 border-b border-white/5">
                    <div className="flex items-center gap-5">
                        <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-500 shadow-glow">
                            <Download size={22} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tighter text-white drop-shadow-lg">{t('settings.data')}</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{t('settings.data_desc')}</p>
                        </div>
                    </div>
                </div>
                <div className="p-8 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button variant="ghost" className="flex-1 gap-3 h-16 rounded-2xl glass-premium border-white/10 hover:bg-white/5 font-black uppercase text-[10px] tracking-[0.2em] text-white active:scale-95 transition-all duration-500" onClick={handleExport}>
                            <Download size={20} className="text-purple-500" />
                            {t('settings.export_btn')}
                        </Button>
                        <Button variant="ghost" className="flex-1 gap-3 h-16 rounded-2xl glass-premium border-white/10 hover:bg-white/5 font-black uppercase text-[10px] tracking-[0.2em] text-white active:scale-95 transition-all duration-500" onClick={() => fileInputRef.current?.click()}>
                            <Upload size={20} className="text-emerald-500" />
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
            <div className="glass-premium rounded-[3rem] border-primary/20 bg-primary/5 overflow-hidden group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
                <div className="p-8 border-b border-white/5 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="p-3 rounded-2xl bg-primary/20 border border-primary/30 text-primary shadow-glow animate-pulse">
                            <Sword size={22} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tighter text-primary drop-shadow-lg">{t('settings.spirit_title')}</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{t('settings.spirit_desc')}</p>
                        </div>
                    </div>
                </div>
                <div className="p-8 space-y-6 relative z-10">
                    <div className="flex items-center justify-between p-6 rounded-[2rem] glass-premium border-primary/20">
                        <div className="space-y-2">
                            <Label className="text-lg font-black tracking-tighter text-white">{t('settings.spirit_enable')}</Label>
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{t('dashboard.gamification_desc')}</p>
                        </div>
                        <Button
                            variant={isEnabled ? "default" : "outline"}
                            size="sm"
                            onClick={() => setIsEnabled(!isEnabled)}
                            className={cn(
                                "rounded-full px-10 h-12 font-black tracking-[0.2em] text-[9px] uppercase transition-all duration-500",
                                isEnabled ? "shadow-glow bg-primary hover:bg-primary/80" : "border-white/10 glass-premium text-white"
                            )}
                        >
                            {isEnabled ? t('settings.spirit_on') : t('settings.spirit_off')}
                        </Button>
                    </div>

                    {isEnabled && (
                        <div className="pt-6 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-700">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-6 block px-1">{t('settings.spirit_pet_label')}</Label>
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
                                {PET_OPTIONS.map(pet => (
                                    <button
                                        key={pet.id}
                                        onClick={() => {
                                            setSelectedPet(pet.id);
                                            toast.success(t('settings.spirit_change_success', { name: pet.name }));
                                        }}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-4 rounded-[2rem] border-2 transition-all duration-500 hover:scale-110 active:scale-90",
                                            selectedPet === pet.id
                                                ? "border-primary bg-primary/10 shadow-glow scale-105"
                                                : "border-transparent glass-premium grayscale opacity-30 hover:opacity-100 hover:grayscale-0"
                                        )}
                                    >
                                        <span className="text-4xl mb-2">{pet.emoji}</span>
                                        <span className="text-[8px] font-black uppercase truncate w-full text-center tracking-[0.15em] text-white/60">{pet.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Notification Settings (PWA) */}
            <div className="glass-premium rounded-[3rem] border-indigo-500/20 bg-indigo-500/5 overflow-hidden">
                <div className="p-8 border-b border-indigo-500/10">
                    <div className="flex items-center gap-5">
                        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 shadow-glow">
                            <Bell size={22} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tighter text-indigo-400 drop-shadow-lg">{t('settings.notifications')}</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{t('settings.notifications_desc')}</p>
                        </div>
                    </div>
                </div>
                <div className="p-8 space-y-4">
                    <div className="flex items-center justify-between p-6 rounded-[2rem] glass-premium border-indigo-500/20">
                        <div className="space-y-2">
                            <Label className="text-lg font-black tracking-tighter text-indigo-400">
                                {t('settings.notif_status')}: {permission === 'granted' ? t('settings.notif_status_on') : permission === 'denied' ? t('settings.notif_status_blocked') : t('settings.notif_status_off')}
                            </Label>
                            <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">
                                {permission === 'granted'
                                    ? t('settings.notif_on_desc')
                                    : t('settings.notif_off_desc')}
                            </p>
                        </div>
                        {permission !== 'granted' ? (
                            <Button size="sm" onClick={requestPermission} className="rounded-full px-8 h-12 font-black tracking-[0.2em] text-[10px] uppercase shadow-glow bg-indigo-500 hover:bg-indigo-400">
                                {t('settings.notif_activate_btn')}
                            </Button>
                        ) : (
                            <div className="flex gap-3">
                                <Button variant="ghost" size="sm" onClick={() => sendNotification("Test", "The notification system works!")} className="glass-premium rounded-full px-6 border-indigo-500/20 font-black tracking-[0.2em] text-[9px] uppercase text-indigo-400 h-10">
                                    {t('settings.notif_test_btn')}
                                </Button>
                                <Button variant="ghost" size="icon" onClick={triggerMotivation} title="Surprise Message" className="glass-premium rounded-full w-10 h-10 hover:bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                                    <Zap size={16} />
                                </Button>
                            </div>
                        )}
                    </div>
                    <p className="text-[10px] text-white/20 italic px-4 font-medium">
                        {t('settings.notif_ios_note')}
                    </p>
                </div>
            </div>

            {/* Session & Danger Zone */}
            <div className="grid gap-8 md:grid-cols-2">
                <div className="glass-premium rounded-[3rem] border-rose-500/20 bg-rose-500/5 overflow-hidden group">
                    <div className="p-8 border-b border-rose-500/10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 shadow-glow">
                                <Trash2 size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tighter text-rose-500 drop-shadow-lg">{t('settings.danger_title')}</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{t('settings.danger_desc')}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-8">
                        <Button variant="destructive" className="w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-glow bg-rose-600 hover:bg-rose-500 active:scale-95 transition-all duration-500" onClick={handleResetData}>
                            {t('settings.danger_btn')}
                        </Button>
                    </div>
                </div>

                <div className="glass-premium rounded-[3rem] border-white/10 overflow-hidden">
                    <div className="p-8 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-white/10 border border-white/10 text-white/60">
                                <LogOut size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tighter text-white drop-shadow-lg">{t('settings.session_title')}</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{t('settings.session_desc')}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40"><Timer size={14} /> {t('settings.autolock_label')}</Label>
                            <select
                                value={autoLockMinutes}
                                onChange={e => setAutoLockMinutes(Number(e.target.value))}
                                className="flex h-14 w-full items-center rounded-2xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-black tracking-tight text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer appearance-none"
                            >
                                <option value={0}>{t('settings.autolock_never')}</option>
                                <option value={1}>{t('settings.autolock_min')}</option>
                                <option value={2}>{t('settings.autolock_mins', { count: 2 })}</option>
                                <option value={5}>{t('settings.autolock_mins', { count: 5 })}</option>
                                <option value={15}>{t('settings.autolock_mins', { count: 15 })}</option>
                                <option value={30}>{t('settings.autolock_mins', { count: 30 })}</option>
                            </select>
                        </div>
                        <div className="h-px bg-white/5" />
                        <Button variant="ghost" className="w-full h-14 rounded-2xl glass-premium border-white/10 hover:bg-white/5 font-black uppercase tracking-[0.2em] text-[10px] text-white active:scale-95 transition-all duration-500" onClick={logout}>
                            {t('settings.logout_btn')}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="text-center text-[10px] text-white/10 pt-10 font-black uppercase tracking-[0.5em]">
                VanttFlow v1.2 Beta • Build 2026
            </div>
        </div>
    );
};
