import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

const GamificationContext = createContext();

const LEVELS = [
    { level: 1, minXp: 0, title: 'Novato Financiero' },
    { level: 2, minXp: 100, title: 'Aprendiz de Ahorro' },
    { level: 3, minXp: 250, title: 'Rastreador de Gastos' },
    { level: 4, minXp: 450, title: 'Guardián del Tesoro' },
    { level: 5, minXp: 700, title: 'Ninja del Presupuesto' },
    { level: 6, minXp: 1000, title: 'Maestro de la Fluidez' },
    { level: 7, minXp: 1400, title: 'Inversionista Espíritu' },
    { level: 8, minXp: 1900, title: 'Magnate de VanttFlow' },
    { level: 9, minXp: 2500, title: 'Leyenda Financiera' },
    { level: 10, minXp: 3200, title: 'Deidad del Capital' },
];

const INITIAL_ACHIEVEMENTS = [
    { id: 'first_transaction', name: 'Primer Paso', description: 'Registra tu primera transacción', icon: 'Zap', unlocked: false },
    { id: 'goal_creator', name: 'Arquitecto de Sueños', description: 'Crea tu primera meta de ahorro', icon: 'Target', unlocked: false },
    { id: 'budget_master', name: 'Control Total', description: 'Crea tu primer presupuesto mensual', icon: 'PieChart', unlocked: false },
    { id: 'saving_streak', name: 'Racha Imparable', description: 'Usa la app 3 días seguidos', icon: 'Flame', unlocked: false },
];

const MISSION_POOL = [
    { id: 'reg_trans', title: 'Registrar una transacción', xp: 30, icon: 'Receipt' },
    { id: 'add_goal', title: 'Definir un nuevo sueño (Meta)', xp: 50, icon: 'Target' },
    { id: 'check_budget', title: 'Revisar mis límites (Presupuestos)', xp: 20, icon: 'PieChart' },
    { id: 'add_scheduled', title: 'Programar un pago futuro', xp: 40, icon: 'CalendarClock' },
    { id: 'visit_analytics', title: 'Analizar mis números', xp: 25, icon: 'BarChart3' },
];

export const GamificationProvider = ({ children }) => {
    const [isEnabled, setIsEnabled] = useLocalStorage('gamification_enabled', true);
    const [selectedPet, setSelectedPet] = useLocalStorage('gamification_selected_pet', 'fox');
    const [xp, setXp] = useLocalStorage('gamification_xp', 0);
    const [achievements, setAchievements] = useLocalStorage('gamification_achievements', INITIAL_ACHIEVEMENTS);
    const [lastLoginDate, setLastLoginDate] = useLocalStorage('gamification_last_login', null);
    const [loginStreak, setLoginStreak] = useLocalStorage('gamification_streak', 0);
    const [dailyMissions, setDailyMissions] = useLocalStorage('gamification_daily_missions', []);
    const [lastMissionsDate, setLastMissionsDate] = useLocalStorage('gamification_missions_date', null);

    const currentLevelInfo = LEVELS.reduce((prev, curr) => (xp >= curr.minXp ? curr : prev), LEVELS[0]);
    const nextLevelInfo = LEVELS.find(l => l.level === currentLevelInfo.level + 1) || null;

    const gainXp = (amount, reason) => {
        if (!isEnabled) return;
        const oldLevel = currentLevelInfo.level;
        setXp(prev => prev + amount);

        // Notification for XP gain
        toast(`+${amount} XP`, {
            description: reason,
            duration: 2000,
            position: 'top-right'
        });
    };

    // Check for Level Up
    useEffect(() => {
        if (!isEnabled) return;
        const newLevelInfo = LEVELS.reduce((prev, curr) => (xp >= curr.minXp ? curr : prev), LEVELS[0]);
        const savedLevel = Number(localStorage.getItem('gamification_last_level_notified')) || 1;

        if (newLevelInfo.level > savedLevel) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
            });

            toast.success(`🎉 ¡NIVEL ${newLevelInfo.level}!`, {
                description: `Has ascendido a: ${newLevelInfo.title}`,
                duration: 5000,
            });

            localStorage.setItem('gamification_last_level_notified', newLevelInfo.level.toString());
        }
    }, [xp, isEnabled]);

    const unlockAchievement = (id) => {
        if (!isEnabled) return;
        setAchievements(prev => {
            const achievement = prev.find(a => a.id === id);
            if (achievement && !achievement.unlocked) {
                toast(`🏆 Logro Desbloqueado: ${achievement.name}`, {
                    description: achievement.description,
                    duration: 4000
                });
                return prev.map(a => a.id === id ? { ...a, unlocked: true } : a);
            }
            return prev;
        });
    };

    // Initialize Missions and Streak
    useEffect(() => {
        if (!isEnabled) return;
        const today = new Date().toISOString().split('T')[0];

        // Streak Logic
        if (lastLoginDate !== today) {
            setLastLoginDate(today);
            setLoginStreak(prev => prev + 1);
            gainXp(20, 'Bono de entrada diaria');
            if (loginStreak + 1 >= 3) {
                unlockAchievement('saving_streak');
            }
        }

        // Missions Generation Logic
        if (lastMissionsDate !== today) {
            // Pick 3 random missions from the pool
            const shuffled = [...MISSION_POOL].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 3).map(m => ({ ...m, completed: false }));
            setDailyMissions(selected);
            setLastMissionsDate(today);
        }
    }, [isEnabled]);

    const completeMission = (missionId) => {
        if (!isEnabled) return;
        setDailyMissions(prev => {
            const mission = prev.find(m => m.id === missionId);
            if (mission && !mission.completed) {
                gainXp(mission.xp, `Misión completada: ${mission.title}`);
                return prev.map(m => m.id === missionId ? { ...m, completed: true } : m);
            }
            return prev;
        });
    };

    const value = {
        isEnabled,
        setIsEnabled,
        selectedPet,
        setSelectedPet,
        xp,
        currentLevel: currentLevelInfo,
        nextLevel: nextLevelInfo,
        achievements,
        gainXp,
        unlockAchievement,
        loginStreak,
        dailyMissions,
        completeMission
    };

    return (
        <GamificationContext.Provider value={value}>
            {children}
        </GamificationContext.Provider>
    );
};

export const useGamification = () => {
    const context = useContext(GamificationContext);
    if (!context) {
        throw new Error('useGamification must be used within a GamificationProvider');
    }
    return context;
};
