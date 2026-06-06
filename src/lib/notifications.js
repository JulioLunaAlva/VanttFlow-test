export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
        console.warn("Este navegador no soporta notificaciones de escritorio");
        return false;
    }
    
    if (Notification.permission === "granted") {
        return true;
    }
    
    if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        return permission === "granted";
    }
    
    return false;
};

export const sendNotification = (title, options = {}) => {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === "granted") {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, {
                    icon: '/pwa-192x192.png',
                    badge: '/pwa-192x192.png',
                    vibrate: [200, 100, 200],
                    ...options
                });
            }).catch(() => {
                new Notification(title, { icon: '/pwa-192x192.png', ...options });
            });
        } else {
            new Notification(title, { icon: '/pwa-192x192.png', ...options });
        }
    }
};

export const checkScheduledPaymentsForNotifications = (scheduledPaymentsList) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const todayStr = new Date().toISOString().split('T')[0];
    const lastNotified = localStorage.getItem('vanttflow_last_notified');
    
    if (lastNotified === todayStr) return; // Ya se notificó hoy

    // Filtrar los que están programados exactamente para la fecha de hoy
    // scheduledPaymentsList viene del resultado de getScheduledForMonth()
    const pendingToday = scheduledPaymentsList.filter(p => {
        if (p.state !== 'pending') return false;
        if (!p.currentMonthDate) return false;
        const pDateStr = new Date(p.currentMonthDate).toISOString().split('T')[0];
        return pDateStr === todayStr;
    });

    if (pendingToday.length > 0) {
        sendNotification('Recordatorio de Pagos 📅', {
            body: `Tienes ${pendingToday.length} pago(s) pendiente(s) programado(s) para el día de hoy. ¡No olvides registrarlos!`,
            tag: 'scheduled-payments', // Evita notificaciones duplicadas en la bandeja
        });
        localStorage.setItem('vanttflow_last_notified', todayStr);
    }
};
