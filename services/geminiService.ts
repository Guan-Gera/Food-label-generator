import { GoogleGenAI, Type } from "@google/genai";
import { LabelContent, Language, TranslatedLabels } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert food regulatory translator specializing in EU (European Union) and UK food labeling laws (FIC Regulation).
Your task is to translate food product information from Chinese into English (UK), German, French, and Italian.

Rules:
1. Terminology: Use strict legal terminology for nutrition tables (e.g., "Energy", "Fat", "of which saturates", "Carbohydrate", "of which sugars", "Protein", "Salt").
2. Allergens: Ensure allergens are clearly translated. 
3. Dates: If the input for date is "见包装喷码" or similar, translate it to "See printing on package" or standard local equivalents (e.g., DE: "Siehe Aufdruck", FR: "Voir impression").
4. Formatting: Keep the tone professional and compliant.
5. Missing Data: If a field is empty in the source, keep it empty in the translation.
6. Addresses: Translate country names in addresses, but keep street names/city names recognizable if translation causes confusion, or translate standard parts (e.g. "Road", "Street").
`;

export const translateLabelData = async (sourceData: LabelContent): Promise<TranslatedLabels> => {
  const model = "gemini-2.5-flash";
  
  // Helper to create the property schema for each language to avoid repetition
  const getLanguageSchema = () => ({
    type: Type.OBJECT,
    properties: {
      productName: { type: Type.STRING },
      netWeight: { type: Type.STRING },
      ingredients: { type: Type.STRING },
      allergens: { type: Type.STRING },
      storage: { type: Type.STRING },
      shelfLife: { type: Type.STRING },
      productionDate: { type: Type.STRING },
      origin: { type: Type.STRING },
      usage: { type: Type.STRING },
      distributor: { type: Type.STRING },
      batchNumber: { type: Type.STRING },
      nutrition: {
        type: Type.OBJECT,
        properties: {
          energyKj: { type: Type.STRING },
          energyKcal: { type: Type.STRING },
          fat: { type: Type.STRING },
          saturates: { type: Type.STRING },
          carbohydrate: { type: Type.STRING },
          sugars: { type: Type.STRING },
          protein: { type: Type.STRING },
          salt: { type: Type.STRING },
        }
      }
    }
  });

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      EN: getLanguageSchema(),
      DE: getLanguageSchema(),
      FR: getLanguageSchema(),
      IT: getLanguageSchema()
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: JSON.stringify(sourceData),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    
    return JSON.parse(jsonText) as TranslatedLabels;
  } catch (error) {
    console.error("Translation failed", error);
    throw error;
  }
};