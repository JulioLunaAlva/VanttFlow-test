import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, dbFirestore, doc, setDoc, getDoc } from '@/lib/firebase';
import { db } from '@/lib/db';
import { toast } from 'sonner';
import { useIdentity } from './IdentityContext';

const SyncContext = createContext();

export const useSync = () => useContext(SyncContext);

export const SyncProvider = ({ children }) => {
    const [firebaseUser, setFirebaseUser] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState(() => localStorage.getItem('last_cloud_sync'));
    const { updateProfile } = useIdentity();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setFirebaseUser(user);
        });
        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            toast.success(`Conectado como ${result.user.displayName}`);
            // Check if there is data in cloud
            const cloudHasData = await checkCloudBackup(result.user.uid);
            if (cloudHasData) {
                // Confirm if user wants to restore
                if (confirm('Se encontró un respaldo en la nube. ¿Deseas restaurarlo en este dispositivo? (Recomendado para teléfonos nuevos)')) {
                    await restoreFromCloud(result.user.uid);
                    return { status: 'RESTORED' };
                }
            }
            
            // If no cloud data, or user declined to restore, they are considered a "New User" from the device's perspective
            // We do NOT backup immediately, to avoid overwriting their cloud data with an empty local state.
            return { status: 'NEW_USER', user: result.user };
        } catch (error) {
            console.error('Error in Google Login:', error);
            toast.error('Error al iniciar sesión con Google');
            return { status: 'ERROR', error };
        }
    };

    const logoutGoogle = async () => {
        try {
            await signOut(auth);
            toast.success('Desconectado de la Nube');
        } catch (error) {
            console.error(error);
        }
    };

    const checkCloudBackup = async (uid) => {
        const docRef = doc(dbFirestore, 'backups', uid);
        const docSnap = await getDoc(docRef);
        return docSnap.exists();
    };

    // Helper to extract full local state
    const exportLocalState = async () => {
        return {
            transactions: await db.transactions.toArray(),
            categories: await db.categories.toArray(),
            accounts: await db.accounts.toArray(),
            scheduledPayments: await db.scheduledPayments.toArray(),
            paymentInstances: await db.paymentInstances.toArray(),
            budgets: await db.budgets.toArray(),
            goals: await db.goals.toArray(),
            notes: await db.notes.toArray(),
            ious: await db.ious.toArray(),
            identity: JSON.parse(localStorage.getItem('vantt_identity') || 'null'),
            privacyMode: JSON.parse(localStorage.getItem('vantt_privacy_mode') || 'false'),
            gamification: {
                enabled: JSON.parse(localStorage.getItem('gamification_enabled') || 'true'),
                pet: JSON.parse(localStorage.getItem('gamification_selected_pet') || '"fox"'),
                xp: JSON.parse(localStorage.getItem('gamification_xp') || '0')
            }
        };
    };

    const backupToCloud = async (uid = firebaseUser?.uid) => {
        if (!uid) return;
        setIsSyncing(true);
        try {
            const data = await exportLocalState();
            await setDoc(doc(dbFirestore, 'backups', uid), {
                data: JSON.stringify(data),
                updatedAt: new Date().toISOString()
            });
            const now = new Date().toISOString();
            setLastSyncTime(now);
            localStorage.setItem('last_cloud_sync', now);
            toast.success('Respaldo guardado en la nube');
        } catch (error) {
            console.error('Cloud Backup Error:', error);
            toast.error('Error al subir a la nube');
        } finally {
            setIsSyncing(false);
        }
    };

    const restoreFromCloud = async (uid = firebaseUser?.uid) => {
        if (!uid) return;
        setIsSyncing(true);
        const toastId = toast.loading('Restaurando desde la nube...');
        try {
            const docRef = doc(dbFirestore, 'backups', uid);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                toast.error('No hay respaldos en la nube para esta cuenta', { id: toastId });
                return;
            }

            const rawData = docSnap.data().data;
            const data = JSON.parse(rawData);

            // Restore Dexie
            await db.transaction('rw', db.transactions, db.categories, db.accounts, db.scheduledPayments, db.paymentInstances, db.budgets, db.goals, db.notes, db.ious, async () => {
                await db.transactions.clear();
                if (data.transactions?.length) await db.transactions.bulkAdd(data.transactions);
                
                await db.categories.clear();
                if (data.categories?.length) await db.categories.bulkAdd(data.categories);

                await db.accounts.clear();
                if (data.accounts?.length) await db.accounts.bulkAdd(data.accounts);

                await db.scheduledPayments.clear();
                if (data.scheduledPayments?.length) await db.scheduledPayments.bulkAdd(data.scheduledPayments);

                await db.paymentInstances.clear();
                if (data.paymentInstances?.length) await db.paymentInstances.bulkAdd(data.paymentInstances);

                await db.budgets.clear();
                if (data.budgets?.length) await db.budgets.bulkAdd(data.budgets);

                await db.goals.clear();
                if (data.goals?.length) await db.goals.bulkAdd(data.goals);

                await db.notes.clear();
                if (data.notes?.length) await db.notes.bulkAdd(data.notes);

                await db.ious.clear();
                if (data.ious?.length) await db.ious.bulkAdd(data.ious);
            });

            // Restore LocalStorage
            if (data.identity) localStorage.setItem('vantt_identity', JSON.stringify(data.identity));
            if (data.privacyMode !== undefined) localStorage.setItem('vantt_privacy_mode', JSON.stringify(data.privacyMode));
            
            if (data.gamification) {
                localStorage.setItem('gamification_enabled', JSON.stringify(data.gamification.enabled));
                localStorage.setItem('gamification_selected_pet', JSON.stringify(data.gamification.pet));
                localStorage.setItem('gamification_xp', JSON.stringify(data.gamification.xp));
            }

            toast.success('Restauración completada. Reiniciando...', { id: toastId });
            setTimeout(() => window.location.reload(), 1500);

        } catch (error) {
            console.error('Restore Error:', error);
            toast.error('Error al restaurar desde la nube', { id: toastId });
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <SyncContext.Provider value={{
            firebaseUser,
            isSyncing,
            lastSyncTime,
            loginWithGoogle,
            logoutGoogle,
            backupToCloud,
            restoreFromCloud
        }}>
            {children}
        </SyncContext.Provider>
    );
};
