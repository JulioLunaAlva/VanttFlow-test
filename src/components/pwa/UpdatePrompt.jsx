import React, { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X, Sparkles } from 'lucide-react';

/**
 * UpdatePrompt — Shows a premium banner when a new app version is available.
 * Uses the VitePWA `useRegisterSW` hook to detect and apply updates immediately.
 * 
 * How it works:
 * 1. VitePWA detects a new Service Worker waiting in the background
 * 2. This component shows a banner with "Nueva versión disponible"
 * 3. When the user taps "Actualizar", it calls updateServiceWorker(true)
 *    which sends `skipWaiting` to the SW and reloads the page with fresh code
 */
export const UpdatePrompt = () => {
    const [showBanner, setShowBanner] = useState(false);

    const {
        needRefresh: [needRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegisteredSW(swUrl, r) {
            // Poll every 60 seconds to check for new service worker
            if (r) {
                setInterval(async () => {
                    if (!(!r.installing && navigator)) return;
                    if (('connection' in navigator) && !navigator.onLine) return;
                    const resp = await fetch(swUrl, {
                        cache: 'no-store',
                        headers: { 'cache': 'no-store', 'cache-control': 'no-cache' },
                    });
                    if (resp?.status === 200) await r.update();
                }, 60 * 1000);
            }
        },
        onNeedRefresh() {
            setShowBanner(true);
        },
        onOfflineReady() {
            // Silently ready for offline use
        },
    });

    const handleUpdate = () => {
        setShowBanner(false);
        updateServiceWorker(true);
    };

    const handleDismiss = () => {
        setShowBanner(false);
    };

    return (
        <AnimatePresence>
            {(needRefresh || showBanner) && (
                <motion.div
                    initial={{ y: 120, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 120, opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="fixed bottom-[calc(env(safe-area-inset-bottom)+6rem)] md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-[200]"
                >
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-primary/30">
                        {/* Gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-purple-700" />
                        <div className="absolute inset-0 backdrop-blur-xl" />

                        {/* Ambient glow */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-foreground/10 rounded-full blur-[40px]" />

                        <div className="relative z-10 p-5 flex items-center gap-4">
                            {/* Icon */}
                            <div className="w-12 h-12 rounded-2xl bg-foreground/20 flex items-center justify-center flex-shrink-0 shadow-lg border border-border/50">
                                <Sparkles className="w-6 h-6 text-foreground animate-pulse" />
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <p className="text-foreground font-black text-sm tracking-tight leading-none">
                                    ¡Nueva versión lista!
                                </p>
                                <p className="text-foreground/70 text-[11px] font-medium mt-1 leading-tight">
                                    Toca actualizar para obtener las mejoras más recientes
                                </p>
                            </div>

                            {/* Dismiss button */}
                            <button
                                onClick={handleDismiss}
                                className="w-7 h-7 rounded-full bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center transition-colors flex-shrink-0 active:scale-90"
                            >
                                <X className="w-3.5 h-3.5 text-foreground/80" />
                            </button>
                        </div>

                        {/* Action button */}
                        <div className="relative z-10 px-5 pb-5">
                            <button
                                onClick={handleUpdate}
                                className="w-full bg-card text-primary font-black text-sm py-3 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg active:scale-95 transition-all duration-200 hover:bg-foreground/90"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Actualizar ahora
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
