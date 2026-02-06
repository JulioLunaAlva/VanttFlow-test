import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

const IdentityContext = createContext();

export const IdentityProvider = ({ children }) => {
    // User Structure: { name: string, pin: string, currency: string, onboardingCompleted: boolean }
    const [user, setUser] = useLocalStorage('vantt_identity', null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [privacyMode, setPrivacyMode] = useLocalStorage('vantt_privacy_mode', false);
    const [autoLockMinutes, setAutoLockMinutes] = useLocalStorage('vantt_auto_lock', 5); // Default 5 mins

    const hashPin = async (pin) => {
        if (!pin) return null;
        const encoder = new TextEncoder();
        const data = encoder.encode(pin);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };

    const login = async (pin) => {
        if (!user) return false;

        const inputHash = await hashPin(pin);

        // Check for plain text legacy PIN (migration)
        if (user.pin.length === 4 && user.pin === pin) {
            setIsAuthenticated(true);
            // Migrate to hash immediately
            setUser(prev => ({ ...prev, pin: inputHash }));
            toast.success(`Bienvenido (Perfil actualizado), ${user.name}`);
            return true;
        }

        if (user.pin === inputHash) {
            setIsAuthenticated(true);
            toast.success(`Bienvenido de nuevo, ${user.name}`);
            return true;
        }
        return false;
    };

    const register = async (name, pin, currency = 'MXN') => {
        const hashedPin = await hashPin(pin);
        const newUser = {
            name,
            pin: hashedPin,
            currency,
            onboardingCompleted: true,
            createdAt: new Date().toISOString()
        };
        setUser(newUser);
        setIsAuthenticated(true); // Auto login on register
        toast.success('¡Perfil creado con éxito!');
        return true;
    };

    const logout = () => {
        setIsAuthenticated(false);
        toast.info('Sesión cerrada');
    };

    const updateProfile = async (updates) => {
        const finalUpdates = { ...updates };
        if (updates.pin && updates.pin.length === 4) {
            finalUpdates.pin = await hashPin(updates.pin);
        }
        setUser(prev => ({ ...prev, ...finalUpdates }));
        toast.success('Perfil actualizado');
    };

    // --- Auto Lock Logic ---
    useEffect(() => {
        if (!isAuthenticated) return;
        if (autoLockMinutes === 0) return; // 0 = Disabled

        let timeout;
        const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

        const resetTimer = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                setIsAuthenticated(false);
                toast.warning('Sesión cerrada por inactividad', { icon: '🔒' });
            }, autoLockMinutes * 60 * 1000);
        };

        // Init timer
        resetTimer();

        // Listeners
        events.forEach(event => window.addEventListener(event, resetTimer));

        return () => {
            clearTimeout(timeout);
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, [isAuthenticated, autoLockMinutes]);

    // Auto-login if no PIN set? No, we want security.
    // But for MVP if user just created account, they are authed.

    const value = {
        user,
        isAuthenticated,
        privacyMode,
        setPrivacyMode,
        autoLockMinutes,
        setAutoLockMinutes,
        login,
        register,
        logout,
        updateProfile
    };

    return (
        <IdentityContext.Provider value={value}>
            {children}
        </IdentityContext.Provider>
    );
};

export const useIdentity = () => {
    const context = useContext(IdentityContext);
    if (!context) {
        throw new Error('useIdentity must be used within an IdentityProvider');
    }
    return context;
};
