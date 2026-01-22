import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { motion, AnimatePresence } from 'framer-motion';

export const OfflineIndicator = () => {
    const isOnline = useOnlineStatus();
    const [showOnlineMessage, setShowOnlineMessage] = React.useState(false);

    React.useEffect(() => {
        if (isOnline && !showOnlineMessage) {
            // Show "back online" message briefly
            setShowOnlineMessage(true);
            const timer = setTimeout(() => setShowOnlineMessage(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isOnline]);

    return (
        <AnimatePresence>
            {!isOnline && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed top-0 left-0 right-0 bg-amber-500 text-white px-4 py-3 text-center text-sm font-bold z-[100] shadow-lg"
                >
                    <div className="flex items-center justify-center gap-2">
                        <WifiOff className="w-4 h-4" />
                        <span>Sin conexión - Los cambios se guardan localmente</span>
                    </div>
                </motion.div>
            )}
            {showOnlineMessage && isOnline && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed top-0 left-0 right-0 bg-emerald-500 text-white px-4 py-3 text-center text-sm font-bold z-[100] shadow-lg"
                >
                    <div className="flex items-center justify-center gap-2">
                        <Wifi className="w-4 h-4" />
                        <span>Conexión restaurada</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
