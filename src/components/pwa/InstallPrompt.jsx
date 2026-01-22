<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Check if user already dismissed the prompt
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (dismissed) {
            return;
        }

        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);

            // Show prompt after a delay (better UX)
            setTimeout(() => {
                setShowPrompt(true);
            }, 5000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Listen for successful installation
        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setShowPrompt(false);
            console.log('✅ PWA instalada exitosamente');
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('✅ Usuario aceptó instalar la PWA');
            setShowPrompt(false);
        } else {
            console.log('❌ Usuario rechazó instalar la PWA');
        }

        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-install-dismissed', 'true');
    };

    if (isInstalled || !showPrompt) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50"
            >
                <div className="bg-card/95 backdrop-blur-xl border-2 border-primary/30 rounded-2xl shadow-2xl p-4">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                            <Download className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-black text-base mb-1">Instala VanttFlow</h3>
                            <p className="text-sm text-foreground/70 mb-3">
                                Accede más rápido y úsala sin conexión. ¡Como una app nativa!
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleInstall}
                                    size="sm"
                                    className="flex-1 font-bold"
                                >
                                    Instalar
                                </Button>
                                <Button
                                    onClick={handleDismiss}
                                    size="sm"
                                    variant="ghost"
                                    className="px-3"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
=======
import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Check if user already dismissed the prompt
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (dismissed) {
            return;
        }

        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);

            // Show prompt after a delay (better UX)
            setTimeout(() => {
                setShowPrompt(true);
            }, 5000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Listen for successful installation
        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setShowPrompt(false);
            console.log('✅ PWA instalada exitosamente');
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('✅ Usuario aceptó instalar la PWA');
            setShowPrompt(false);
        } else {
            console.log('❌ Usuario rechazó instalar la PWA');
        }

        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-install-dismissed', 'true');
    };

    if (isInstalled || !showPrompt) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50"
            >
                <div className="bg-card/95 backdrop-blur-xl border-2 border-primary/30 rounded-2xl shadow-2xl p-4">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                            <Download className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-black text-base mb-1">Instala VanttFlow</h3>
                            <p className="text-sm text-foreground/70 mb-3">
                                Accede más rápido y úsala sin conexión. ¡Como una app nativa!
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleInstall}
                                    size="sm"
                                    className="flex-1 font-bold"
                                >
                                    Instalar
                                </Button>
                                <Button
                                    onClick={handleDismiss}
                                    size="sm"
                                    variant="ghost"
                                    className="px-3"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
>>>>>>> 5514d7732ec911852e1fd69f7bbfd09383699edc
