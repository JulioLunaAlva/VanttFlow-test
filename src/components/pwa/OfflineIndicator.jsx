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
                    initial={{ y: -100, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -100, opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="fixed top-[calc(env(safe-area-inset-top)+1rem)] left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:min-w-[320px] rounded-2xl z-[100] shadow-2xl"
                >
                    <div className="bg-amber-500/90 backdrop-blur-md text-white px-4 py-3 rounded-2xl border border-amber-400/50 flex items-center justify-center gap-3 shadow-amber-500/20">
                        <div className="bg-white/20 p-1.5 rounded-full">
                            <WifiOff className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black tracking-tight leading-none">Sin conexión</span>
                            <span className="text-[10px] font-medium opacity-90 leading-tight mt-0.5">Modo offline activado</span>
                        </div>
                    </div>
                </motion.div>
            )}
            {showOnlineMessage && isOnline && (
                <motion.div
                    initial={{ y: -100, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -100, opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="fixed top-[calc(env(safe-area-inset-top)+1rem)] left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:min-w-[320px] rounded-2xl z-[100] shadow-2xl"
                >
                    <div className="bg-emerald-600/90 backdrop-blur-md text-white px-4 py-3 rounded-2xl border border-emerald-500/50 flex items-center justify-center gap-3 shadow-emerald-500/20">
                        <div className="bg-white/20 p-1.5 rounded-full">
                            <Wifi className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black tracking-tight leading-none">Conexión restaurada</span>
                            <span className="text-[10px] font-medium opacity-90 leading-tight mt-0.5">Sincronización en segundo plano</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
