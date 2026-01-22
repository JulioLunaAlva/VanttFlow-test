/**
 * AI Parser for VanttFlow
 * Parses natural language strings into financial transaction objects.
 * Supports Spanish, English, Portuguese, and French patterns.
 */

const CATEGORY_KEYWORDS = {
    food: ['comida', 'restaurante', 'cena', 'almuerzo', 'desayuno', 'food', 'restaurant', 'dinner', 'lunch', 'breakfast', 'alimento', 'refeição', 'jantar', 'almoço', 'café', 'nourriture', 'dîner', 'déjeuner'],
    transport: ['transporte', 'gasolina', 'uber', 'taxi', 'bus', 'metro', 'gas', 'gasoline', 'fuel', 'combustible', 'combustível', 'essence'],
    housing: ['renta', 'alquiler', 'hipoteca', 'casa', 'rent', 'mortgage', 'home', 'house', 'aluguel', 'casa', 'loyer', 'maison'],
    utilities: ['luz', 'agua', 'internet', 'gas', 'servicios', 'electricidad', 'electricity', 'water', 'services', 'conta', 'água', 'lumière', 'eau'],
    entertainment: ['cine', 'juegos', 'netflix', 'spotify', 'diversion', 'cinema', 'movies', 'games', 'fun', 'entretenimento', 'jogos', 'divertissement', 'jeux'],
    shopping: ['compras', 'supermercado', 'tienda', 'amazon', 'shopping', 'store', 'market', 'loja', 'mercado', 'magasin'],
    health: ['doctor', 'medicina', 'farmacia', 'gimnasio', 'gym', 'health', 'medicine', 'pharmacy', 'saúde', 'médico', 'farmácia', 'santé', 'médecin', 'pharmacie'],
    salary: ['sueldo', 'nomina', 'salario', 'pago', 'salary', 'payroll', 'pay', 'salário', 'pagamento', 'salaire'],
};

export const parseAISuggestion = (text, categories = []) => {
    const input = text.toLowerCase();

    // 1. Detect Amount
    // Matches "100", "100.50", "$100", "100€", etc.
    const amountRegex = /([$€¥£]?)(\d+(?:[.,]\d{1,2})?)([$€¥£]?)/;
    const amountMatch = input.match(amountRegex);
    const amount = amountMatch ? parseFloat(amountMatch[2].replace(',', '.')) : null;

    if (!amount) return null;

    // 2. Detect Type (income vs expense)
    let type = 'expense';
    const incomeKeywords = ['recibi', 'gane', 'ingreso', 'sueldo', 'nomina', 'deposito', 'received', 'earned', 'income', 'salary', 'deposit', 'recebi', 'ganhei', 'depósito', 'reçu', 'gagné'];

    if (incomeKeywords.some(kw => input.includes(kw))) {
        type = 'income';
    }

    // 3. Detect Category
    let categoryId = 'other';

    // First check against keywords map
    for (const [id, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some(kw => input.includes(kw))) {
            // Ensure the category actually exists in the provided list if possible
            const exists = categories.length === 0 || categories.find(c => c.id === id);
            if (exists) {
                categoryId = id;
                break;
            }
        }
    }

    // 4. Extract Description
    // Try to find the word after "en", "para", "de", "on", "for", etc.
    let description = text;
    const fillers = [' en ', ' para ', ' de ', ' on ', ' for ', ' sur ', ' pour '];
    for (const filler of fillers) {
        if (input.includes(filler)) {
            const parts = text.split(new RegExp(filler, 'i'));
            if (parts.length > 1) {
                description = parts[1].trim();
                break;
            }
        }
    }

    return {
        amount,
        type,
        category: categoryId,
        description: description.charAt(0).toUpperCase() + description.slice(1),
        date: new Date().toISOString()
    };
};
