<<<<<<< HEAD
import React, { useState } from 'react';
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, FileSpreadsheet, CheckCircle, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { AccountSelect } from "@/components/ui/AccountSelect";
import { CategorySelect } from "@/components/ui/CategorySelect";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select } from "@/components/ui/select";
import { toast } from 'sonner';

export const ImportPage = () => {
    const { addTransactions, accounts, categories } = useFinance();
    const [step, setStep] = useState(1); // 1: Upload, 2: Map, 3: Preview
    const [file, setFile] = useState(null);
    const [csvData, setCsvData] = useState([]); // Array of Arrays
    const [headers, setHeaders] = useState([]);

    // Mapping state
    const [mapping, setMapping] = useState({
        date: '',
        description: '',
        amount: '' // Positive for Income, Negative for Expense OR depends on sign
    });

    const [targetAccount, setTargetAccount] = useState('');

    // Parse CSV (Simplified)
    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files[0];
        if (!uploadedFile) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const lines = text.split('\n').filter(line => line.trim() !== '');
            if (lines.length < 2) {
                toast.error("El archivo parece vacío o inválido");
                return;
            }
            // Simple split by comma, ignoring quotes for MVP (Ideally use a lib like PapaParse)
            const parsed = lines.map(line => line.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));

            setHeaders(parsed[0]);
            setCsvData(parsed.slice(1));
            setFile(uploadedFile);
            setStep(2);
        };
        reader.readAsText(uploadedFile);
    };

    const handleImport = () => {
        if (!targetAccount) {
            toast.error("Selecciona una cuenta de destino");
            return;
        }

        const dateIndex = headers.indexOf(mapping.date);
        const descIndex = headers.indexOf(mapping.description);
        const amountIndex = headers.indexOf(mapping.amount);

        if (dateIndex === -1 || descIndex === -1 || amountIndex === -1) {
            toast.error("Por favor completa el mapeo de columnas");
            return;
        }

        const transactionsToImport = csvData.map(row => {
            if (row.length < headers.length) return null; // Skip invalid rows

            const dateStr = row[dateIndex];
            const desc = row[descIndex];
            const amountStr = row[amountIndex];

            // Try to parse amount
            // Remove currency symbols, commas if used as thousands separator
            const cleanAmount = parseFloat(amountStr.replace(/[^0-9.-]/g, ''));
            if (isNaN(cleanAmount)) return null;

            // Simple Auto-Category Logic (MVP)
            const amount = Math.abs(cleanAmount);
            const type = cleanAmount >= 0 ? 'income' : 'expense';
            // NOTE: Banks usually give negative for expense. If bank gives positive for expense, user needs to handle sign... 
            // For this MVP assuming Negative = Expense.

            // Build Transaction Object
            return {
                type,
                amount,
                category: 'uncategorized', // Default
                description: desc,
                date: new Date(dateStr).toISOString(), // Basic ISO assumption, might need dayjs for other formats
                accountId: targetAccount,
                isImported: true
            };
        }).filter(t => t !== null);

        if (transactionsToImport.length === 0) {
            toast.error("No se pudieron extraer transacciones válidas");
            return;
        }

        addTransactions(transactionsToImport);
        toast.success(`¡Éxito! ${transactionsToImport.length} transacciones importadas.`);
        setStep(1);
        setFile(null);
        setCsvData([]);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Importador Inteligente</h2>
                <p className="text-muted-foreground">Carga tus estados de cuenta (CSV) y procesaremos tus movimientos automáticamente.</p>
            </div>

            {/* Steps Indicator */}
            <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                <span className={step >= 1 ? "text-primary flex items-center gap-2" : ""}>
                    <div className="w-6 h-6 rounded-full border flex items-center justify-center bg-background border-primary">1</div> Cargar
                </span>
                <ArrowRight size={16} />
                <span className={step >= 2 ? "text-primary flex items-center gap-2" : ""}>
                    <div className="w-6 h-6 rounded-full border flex items-center justify-center bg-background border-primary">2</div> Mapear
                </span>
                <ArrowRight size={16} />
                <span className={step >= 3 ? "text-primary flex items-center gap-2" : ""}>
                    <div className="w-6 h-6 rounded-full border flex items-center justify-center bg-background border-primary">3</div> Confirmar
                </span>
            </div>

            {step === 1 && (
                <Card className="border-dashed border-2">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                        <div className="p-4 rounded-full bg-muted">
                            <UploadCloud size={48} className="text-muted-foreground" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Arrastra tu archivo CSV aquí</h3>
                            <p className="text-sm text-muted-foreground">O haz clic para explorar tus archivos</p>
                        </div>
                        <Input
                            type="file"
                            accept=".csv"
                            className="w-full max-w-xs cursor-pointer"
                            onChange={handleFileUpload}
                        />
                        <p className="text-xs text-muted-foreground pt-4">Soporta: Santander, BBVA, Banamex (formato CSV estándar)</p>
                    </CardContent>
                </Card>
            )}

            {step === 2 && file && (
                <Card>
                    <CardHeader>
                        <CardTitle>Configuración de Importación</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                            <FileSpreadsheet size={24} />
                            <div className="flex-1">
                                <p className="font-medium text-sm">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB • {csvData.length} filas detectadas</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => { setFile(null); setStep(1); }}>
                                <X size={16} />
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="font-medium text-sm">Destino</h4>
                                <AccountSelect
                                    accounts={accounts}
                                    value={targetAccount}
                                    onChange={setTargetAccount}
                                    placeholder="Selecciona la cuenta destino"
                                />
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-medium text-sm">Mapeo de Columnas</h4>
                                <div className="grid gap-3">
                                    <div className="grid grid-cols-3 items-center gap-2">
                                        <label className="text-sm text-right">Fecha:</label>
                                        <select className="col-span-2 p-2 rounded-md border text-sm bg-background" value={mapping.date} onChange={e => setMapping({ ...mapping, date: e.target.value })}>
                                            <option value="">Selecciona columna...</option>
                                            {headers.map((h, i) => <option key={i} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-2">
                                        <label className="text-sm text-right">Concepto:</label>
                                        <select className="col-span-2 p-2 rounded-md border text-sm bg-background" value={mapping.description} onChange={e => setMapping({ ...mapping, description: e.target.value })}>
                                            <option value="">Selecciona columna...</option>
                                            {headers.map((h, i) => <option key={i} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-2">
                                        <label className="text-sm text-right">Monto:</label>
                                        <select className="col-span-2 p-2 rounded-md border text-sm bg-background" value={mapping.amount} onChange={e => setMapping({ ...mapping, amount: e.target.value })}>
                                            <option value="">Selecciona columna...</option>
                                            {headers.map((h, i) => <option key={i} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={() => setStep(1)}>Atrás</Button>
                            <Button onClick={handleImport} disabled={!targetAccount || !mapping.date || !mapping.amount}>
                                Importar {csvData.length} movimientos
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
=======
import React, { useState } from 'react';
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, FileSpreadsheet, CheckCircle, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { AccountSelect } from "@/components/ui/AccountSelect";
import { CategorySelect } from "@/components/ui/CategorySelect";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select } from "@/components/ui/select";
import { toast } from 'sonner';

export const ImportPage = () => {
    const { addTransactions, accounts, categories } = useFinance();
    const [step, setStep] = useState(1); // 1: Upload, 2: Map, 3: Preview
    const [file, setFile] = useState(null);
    const [csvData, setCsvData] = useState([]); // Array of Arrays
    const [headers, setHeaders] = useState([]);

    // Mapping state
    const [mapping, setMapping] = useState({
        date: '',
        description: '',
        amount: '' // Positive for Income, Negative for Expense OR depends on sign
    });

    const [targetAccount, setTargetAccount] = useState('');

    // Parse CSV (Simplified)
    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files[0];
        if (!uploadedFile) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const lines = text.split('\n').filter(line => line.trim() !== '');
            if (lines.length < 2) {
                toast.error("El archivo parece vacío o inválido");
                return;
            }
            // Simple split by comma, ignoring quotes for MVP (Ideally use a lib like PapaParse)
            const parsed = lines.map(line => line.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));

            setHeaders(parsed[0]);
            setCsvData(parsed.slice(1));
            setFile(uploadedFile);
            setStep(2);
        };
        reader.readAsText(uploadedFile);
    };

    const handleImport = () => {
        if (!targetAccount) {
            toast.error("Selecciona una cuenta de destino");
            return;
        }

        const dateIndex = headers.indexOf(mapping.date);
        const descIndex = headers.indexOf(mapping.description);
        const amountIndex = headers.indexOf(mapping.amount);

        if (dateIndex === -1 || descIndex === -1 || amountIndex === -1) {
            toast.error("Por favor completa el mapeo de columnas");
            return;
        }

        const transactionsToImport = csvData.map(row => {
            if (row.length < headers.length) return null; // Skip invalid rows

            const dateStr = row[dateIndex];
            const desc = row[descIndex];
            const amountStr = row[amountIndex];

            // Try to parse amount
            // Remove currency symbols, commas if used as thousands separator
            const cleanAmount = parseFloat(amountStr.replace(/[^0-9.-]/g, ''));
            if (isNaN(cleanAmount)) return null;

            // Simple Auto-Category Logic (MVP)
            const amount = Math.abs(cleanAmount);
            const type = cleanAmount >= 0 ? 'income' : 'expense';
            // NOTE: Banks usually give negative for expense. If bank gives positive for expense, user needs to handle sign... 
            // For this MVP assuming Negative = Expense.

            // Build Transaction Object
            return {
                type,
                amount,
                category: 'uncategorized', // Default
                description: desc,
                date: new Date(dateStr).toISOString(), // Basic ISO assumption, might need dayjs for other formats
                accountId: targetAccount,
                isImported: true
            };
        }).filter(t => t !== null);

        if (transactionsToImport.length === 0) {
            toast.error("No se pudieron extraer transacciones válidas");
            return;
        }

        addTransactions(transactionsToImport);
        toast.success(`¡Éxito! ${transactionsToImport.length} transacciones importadas.`);
        setStep(1);
        setFile(null);
        setCsvData([]);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Importador Inteligente</h2>
                <p className="text-muted-foreground">Carga tus estados de cuenta (CSV) y procesaremos tus movimientos automáticamente.</p>
            </div>

            {/* Steps Indicator */}
            <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                <span className={step >= 1 ? "text-primary flex items-center gap-2" : ""}>
                    <div className="w-6 h-6 rounded-full border flex items-center justify-center bg-background border-primary">1</div> Cargar
                </span>
                <ArrowRight size={16} />
                <span className={step >= 2 ? "text-primary flex items-center gap-2" : ""}>
                    <div className="w-6 h-6 rounded-full border flex items-center justify-center bg-background border-primary">2</div> Mapear
                </span>
                <ArrowRight size={16} />
                <span className={step >= 3 ? "text-primary flex items-center gap-2" : ""}>
                    <div className="w-6 h-6 rounded-full border flex items-center justify-center bg-background border-primary">3</div> Confirmar
                </span>
            </div>

            {step === 1 && (
                <Card className="border-dashed border-2">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                        <div className="p-4 rounded-full bg-muted">
                            <UploadCloud size={48} className="text-muted-foreground" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Arrastra tu archivo CSV aquí</h3>
                            <p className="text-sm text-muted-foreground">O haz clic para explorar tus archivos</p>
                        </div>
                        <Input
                            type="file"
                            accept=".csv"
                            className="w-full max-w-xs cursor-pointer"
                            onChange={handleFileUpload}
                        />
                        <p className="text-xs text-muted-foreground pt-4">Soporta: Santander, BBVA, Banamex (formato CSV estándar)</p>
                    </CardContent>
                </Card>
            )}

            {step === 2 && file && (
                <Card>
                    <CardHeader>
                        <CardTitle>Configuración de Importación</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                            <FileSpreadsheet size={24} />
                            <div className="flex-1">
                                <p className="font-medium text-sm">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB • {csvData.length} filas detectadas</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => { setFile(null); setStep(1); }}>
                                <X size={16} />
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="font-medium text-sm">Destino</h4>
                                <AccountSelect
                                    accounts={accounts}
                                    value={targetAccount}
                                    onChange={setTargetAccount}
                                    placeholder="Selecciona la cuenta destino"
                                />
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-medium text-sm">Mapeo de Columnas</h4>
                                <div className="grid gap-3">
                                    <div className="grid grid-cols-3 items-center gap-2">
                                        <label className="text-sm text-right">Fecha:</label>
                                        <select className="col-span-2 p-2 rounded-md border text-sm bg-background" value={mapping.date} onChange={e => setMapping({ ...mapping, date: e.target.value })}>
                                            <option value="">Selecciona columna...</option>
                                            {headers.map((h, i) => <option key={i} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-2">
                                        <label className="text-sm text-right">Concepto:</label>
                                        <select className="col-span-2 p-2 rounded-md border text-sm bg-background" value={mapping.description} onChange={e => setMapping({ ...mapping, description: e.target.value })}>
                                            <option value="">Selecciona columna...</option>
                                            {headers.map((h, i) => <option key={i} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-2">
                                        <label className="text-sm text-right">Monto:</label>
                                        <select className="col-span-2 p-2 rounded-md border text-sm bg-background" value={mapping.amount} onChange={e => setMapping({ ...mapping, amount: e.target.value })}>
                                            <option value="">Selecciona columna...</option>
                                            {headers.map((h, i) => <option key={i} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={() => setStep(1)}>Atrás</Button>
                            <Button onClick={handleImport} disabled={!targetAccount || !mapping.date || !mapping.amount}>
                                Importar {csvData.length} movimientos
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
>>>>>>> 5514d7732ec911852e1fd69f7bbfd09383699edc
