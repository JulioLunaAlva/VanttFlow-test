import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [permission, setPermission] = useState('default'); // default, granted, denied
    const [registration, setRegistration] = useState(null);

    useEffect(() => {
        // Initialize permission state
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }

        // Get SW registration
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(reg => {
                setRegistration(reg);
            });
        }
    }, []);

    const requestPermission = async () => {
        if (!('Notification' in window)) {
            toast.error("Tu dispositivo no soporta notificaciones.");
            return 'denied';
        }

        try {
            const result = await Notification.requestPermission();
            setPermission(result);
            if (result === 'granted') {
                toast.success("¡Notificaciones activadas!");
                sendNotification("¡Hola!", "Así se verán tus recordatorios.");
            }
            return result;
        } catch (error) {
            console.error("Error asking permission:", error);
            return 'denied';
        }
    };

    const sendNotification = (title, body, tag = 'general') => {
        if (permission === 'granted') {
            const options = {
                body,
                icon: '/logo.png', // Ensure this path is correct based on public folder
                tag,
                renotify: true,
                badge: '/vite.svg',
                vibrate: [200, 100, 200]
            };

            if (registration && registration.showNotification) {
                registration.showNotification(title, options);
            } else {
                new Notification(title, options);
            }
        }
    };

    // Update App Badge (iOS/Android PWA)
    const updateBadge = (count) => {
        if ('setAppBadge' in navigator) {
            if (count > 0) {
                navigator.setAppBadge(count).catch(e => console.error("Badge error", e));
            } else {
                navigator.clearAppBadge().catch(e => console.error("Badge error", e));
            }
        }
    };

    // Logic for "Random" Motivation
    const triggerMotivation = () => {
        const messages = [
            "¿Ya registraste tus gastos de hoy? 💸",
            "Tu meta de ahorro te espera. 🐖",
            "Recuerda: El interés compuesto es tu amigo. 📈",
            "¿Un cafecito? Regístralo para no perder la racha. ☕",
            "Revisa tu VanttScore hoy. ¿Subiste de nivel? 🏆"
        ];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        sendNotification("VanttFlow", randomMsg, 'motivation');
    };

    return (
        <NotificationContext.Provider value={{
            permission,
            requestPermission,
            sendNotification,
            updateBadge,
            triggerMotivation
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
