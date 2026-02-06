/**
 * AI Parser for VanttFlow
 * Parses natural language strings into financial transaction objects.
 * Supports Spanish, English, Portuguese, and French patterns.
 */

const CATEGORY_KEYWORDS = {
    food: ['comida', 'restaurante', 'cena', 'almuerzo', 'desayuno', 'food', 'restaurant', 'dinner', 'lunch', 'breakfast', 'alimento', 'refeição', 'jantar', 'almoço', 'café', 'nourriture', 'dîner', 'déjeuner', 'merienda', 'snack', 'cafeteria'],
    transport: ['transporte', 'gasolina', 'uber', 'taxi', 'bus', 'metro', 'gas', 'gasoline', 'fuel', 'combustible', 'combustível', 'essence', 'didifood', 'rappi', 'avion', 'vuelo', 'peaje', 'estacionamiento'],
    housing: ['renta', 'alquiler', 'hipoteca', 'casa', 'rent', 'mortgage', 'home', 'house', 'aluguel', 'casa', 'loyer', 'maison', 'mantenimiento', 'reparacion'],
    utilities: ['luz', 'agua', 'internet', 'gas', 'servicios', 'electricidad', 'electricity', 'water', 'services', 'conta', 'água', 'lumière', 'eau', 'telefono', 'celular', 'phone', 'mobile'],
    entertainment: ['cine', 'juegos', 'netflix', 'spotify', 'diversion', 'cinema', 'movies', 'games', 'fun', 'entretenimento', 'jogos', 'divertissement', 'jeux', 'fiesta', 'party', 'alcohol', 'bar', 'club'],
    shopping: ['compras', 'supermercado', 'tienda', 'amazon', 'shopping', 'store', 'market', 'loja', 'mercado', 'magasin', 'ropa', 'clothes', 'shoes', 'electronicos'],
    health: ['doctor', 'medicina', 'farmacia', 'gimnasio', 'gym', 'health', 'medicine', 'pharmacy', 'saúde', 'médico', 'farmácia', 'santé', 'médecin', 'pharmacie', 'dentista', 'hospital'],
    salary: ['sueldo', 'nomina', 'salario', 'pago', 'salary', 'payroll', 'pay', 'salário', 'pagamento', 'salaire', 'bonus', 'aguinaldo', 'utilidades'],
};

const QUERY_KEYWORDS = {
    spending: ['cuanto', 'cuánto', 'gaste', 'gasté', 'spent', 'how much', 'total', 'resumen', 'summary'],
    status: ['estado', 'status', 'como voy', 'cómo voy', 'salud', 'health', 'balance', 'saldo'],
    limits: ['limites', 'presupuesto', 'budget', 'limite', 'queda', 'remaining']
};

export const parseAISuggestion = (text, categories = []) => {
    const input = text.toLowerCase();

    // 1. Detect Intent
    let intent = 'log'; // default intent
    if (QUERY_KEYWORDS.spending.some(kw => input.includes(kw))) intent = 'query_spending';
    else if (QUERY_KEYWORDS.status.some(kw => input.includes(kw))) intent = 'query_status';
    else if (QUERY_KEYWORDS.limits.some(kw => input.includes(kw))) intent = 'query_limits';

    // 2. Detect Amount
    const amountRegex = /([$€¥£]?)(\d+(?:[.,]\d{1,2})?)([$€¥£]?)/;
    const amountMatch = input.match(amountRegex);
    const amount = amountMatch ? parseFloat(amountMatch[2].replace(',', '.')) : null;

    // 3. Detect Type (income vs expense)
    let type = 'expense';
    const incomeKeywords = ['recibi', 'gane', 'ingreso', 'sueldo', 'nomina', 'deposito', 'received', 'earned', 'income', 'salary', 'deposit', 'recebi', 'ganhei', 'depósito', 'reçu', 'gagné', 'abonaron'];

    if (incomeKeywords.some(kw => input.includes(kw))) {
        type = 'income';
    }

    // 4. Detect Category
    let categoryId = 'other';
    for (const [id, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some(kw => input.includes(kw))) {
            const exists = categories.length === 0 || categories.find(c => c.id === id);
            if (exists) {
                categoryId = id;
                break;
            }
        }
    }

    // 5. Extract Description
    let description = text;
    const fillers = [' en ', ' para ', ' de ', ' on ', ' for ', ' sur ', ' pour ', ' gasta en ', ' gasto en '];
    for (const filler of fillers) {
        if (input.includes(filler)) {
            const parts = text.split(new RegExp(filler, 'i'));
            if (parts.length > 1) {
                description = parts[1].trim();
                break;
            }
        }
    }

    // If it's a log intent but no amount, it might be an ambiguous query or failed log
    if (intent === 'log' && !amount) intent = 'unknown';

    return {
        intent,
        amount,
        type,
        category: categoryId,
        description: description.charAt(0).toUpperCase() + description.slice(1),
        date: new Date().toISOString()
    };
};
