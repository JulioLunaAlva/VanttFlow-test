import React, { useEffect } from 'react';
import { exportData } from '@/utils/backup';
import { toast } from 'sonner';
import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AutoBackup = () => {
    const { t } = useTranslation();

    useEffect(() => {
        // Run once on mount (app load)
        const checkBackup = () => {
            const lastBackupStr = localStorage.getItem('last_auto_backup');
            const now = new Date();
            const today = now.toISOString().split('T')[0];

            // Simple prompt on every load as requested
            toast("¿Generar respaldo de seguridad?", {
                description: "Se guardará una copia de tus finanzas en un archivo JSON.",
                action: {
                    label: "Guardar",
                    onClick: () => {
                        const success = exportData();
                        if (success) {
                            toast.success("Respaldo generado con éxito.");
                        }
                    }
                },
                icon: <Download size={18} />,
                duration: 10000, 
            });
        };

        // Delay slightly to not compete with initial load animations
        const timer = setTimeout(checkBackup, 3000);
        return () => clearTimeout(timer);
    }, []);

    return null; // This component doesn't render anything itself
};
