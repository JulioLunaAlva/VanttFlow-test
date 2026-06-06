import React, { useEffect } from 'react';
import { useSync } from '@/context/SyncContext';

export const AutoBackup = () => {
    const { firebaseUser, backupToCloud } = useSync();

    useEffect(() => {
        if (!firebaseUser) return;

        // Auto backup silently 5 seconds after the app loads
        const timer = setTimeout(() => {
            backupToCloud(firebaseUser.uid, true); // true = silent mode
        }, 5000);

        // Auto backup silently every 10 minutes while the app is open
        const interval = setInterval(() => {
            backupToCloud(firebaseUser.uid, true);
        }, 10 * 60 * 1000);

        // Auto backup silently when the user switches apps or minimizes the browser
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                backupToCloud(firebaseUser.uid, true);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [firebaseUser, backupToCloud]);

    return null; // This component doesn't render anything visually
};
