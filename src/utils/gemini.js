import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
console.log("VanttAI - Gemini Engine Loaded. Key Present:", !!API_KEY);
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Convierte un archivo de imagen en un objeto compatible con Gemini
 */
async function fileToGenerativePart(file) {
    const base64EncodedDataPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
}

/**
 * Escanea un ticket/recibo usando Gemini Vision
 */
export const scanReceipt = async (file) => {
    if (!API_KEY) {
        throw new Error("No Gemini API Key found. Please add VITE_GEMINI_API_KEY to your .env file.");
    }

    try {
        const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
        const imagePart = await fileToGenerativePart(file);

        const prompt = `
            Analyze this receipt/ticket image and extract the following information in JSON format:
            {
                "amount": number (total amount),
                "description": string (name of the store/merchant),
                "date": string (YYYY-MM-DD format),
                "category": string (suggested category like Food, Shopping, Transport, Utilities, etc.),
                "type": "expense"
            }
            Only return the JSON object, nothing else. If you cannot find a value, use null.
        `;

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();
        
        // Clean the response in case Gemini adds markdown backticks
        const jsonStr = text.replace(/```json|```/g, "").trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Gemini Scan Error:", error);
        throw error;
    }
};

/**
 * Genera consejos de presupuesto basados en el resumen financiero
 */
export const getAIBudgetAdvice = async (summary, language = "es") => {
    if (!API_KEY) return null;
    console.log("VanttAI - Requesting Budget Advice...");
    try {
        const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
        const prompt = `
            Eres un asesor financiero experto y proactivo para la app VanttFlow.
            Analiza el siguiente resumen mensual:
            Ingresos: ${summary.income}
            Gastos: ${summary.expense}
            Balance: ${summary.balance}
            
            Genera 2 consejos tácticos y breves (máximo 15 palabras cada uno) en idioma ${language}.
            Enfócate en ahorro y eficiencia.
            Devuélvelos como un array de strings en formato JSON: ["Consejo 1", "Consejo 2"]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonStr = text.replace(/```json|```/g, "").trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Gemini Advice Error:", error);
        return null;
    }
};
