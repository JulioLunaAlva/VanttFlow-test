import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

const IdentityContext = createContext();

export const IdentityProvider = ({ children }) => {
    // User Structure: { name: string, pin: string, currency: string, onboardingCompleted: boolean }
    const [user, setUser] = useLocalStorage('vantt_identity', null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [privacyMode, setPrivacyMode] = useLocalStorage('vantt_privacy_mode', false);

    const login = (pin) => {
        if (!user) return false;
        if (user.pin === pin) {
            setIsAuthenticated(true);
            toast.success(`Bienvenido de nuevo, ${user.name}`);
            return true;
        }
        return false;
    };

    const register = (name, pin, currency = 'MXN') => {
        const newUser = {
            name,
            pin,
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

    const updateProfile = (updates) => {
        setUser(prev => ({ ...prev, ...updates }));
        toast.success('Perfil actualizado');
    };

    // Auto-login if no PIN set? No, we want security.
    // But for MVP if user just created account, they are authed.

    const value = {
        user,
        isAuthenticated,
        privacyMode,
        setPrivacyMode,
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
