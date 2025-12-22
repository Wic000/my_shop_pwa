import { GoogleGenAI } from "@google/genai";

export const generateResponse = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `Siz "PC App" do'konining ekspert yordamchisiz.
        - Vazifa: Mijozga noutbuk yoki gaming PC tanlashda yordam berish.
        - Til: O'zbek tili (lotin alifbosi).
        - Uslub: Zamonaviy, do'stona va professional.
        - Bizning afzalliklarimiz: Premium sifat, kafolat, tezkor yetkazib berish.
        Agar foydalanuvchi "salom" desa, PC App do'koniga xush kelibsiz deng.`,
        temperature: 0.7,
      },
    });
    
    return response.text || "Kechirasiz, tushunmadim.";
  } catch (error) {
    return "Hozircha AI xizmati band. Iltimos keyinroq urinib ko'ring.";
  }
};