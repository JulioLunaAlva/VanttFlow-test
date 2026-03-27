/**
 * VanttFlow Backup Service
 * Handles data export to JSON files
 */

export const exportData = () => {
    try {
        const data = {};
        const keysToExport = [
            'finance_data',
            'finance_accounts',
            'finance_categories',
            'finance_goals',
            'dashboard_layout',
            'dashboard_visibility',
            'finance_notes',
            'finance_ious',
            'user_identity',
            'app_settings'
        ];

        keysToExport.forEach(key => {
            const value = localStorage.getItem(key);
            if (value) {
                try {
                    data[key] = JSON.parse(value);
                } catch (e) {
                    data[key] = value;
                }
            }
        });

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        const date = new Date().toISOString().split('T')[0];
        link.href = url;
        link.download = `VanttFlow_Backup_${date}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        return true;
    } catch (error) {
        console.error("Backup Error:", error);
        return false;
    }
};
