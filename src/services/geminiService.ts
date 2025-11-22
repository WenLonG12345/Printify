import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
  }
  return ai;
};

export const generateAINote = async (userPrompt?: string): Promise<string> => {
  const aiClient = getAI();

  // Fallback for empty key to prevent crash in dev if not set
  if (!import.meta.env.VITE_API_KEY) {
    return "I love you more than code loves syntax! (Add API Key for more)";
  }

  const prompt = userPrompt
    ? `Write a single poetic and uplifting sentence inspired by this topic: "${userPrompt}". It must be under 120 characters and follow the system rules.`
    : `Write a single poetic and uplifting sentence about life or self-growth. It must be under 120 characters and follow the system rules.`;

  try {
    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `
          You are a master of micro-poetry and short inspirational quotes.
          You write original, uplifting, poetic lines that feel human and thoughtful.
          Rules:
          - Output only one sentence.
          - Must feel positive, hopeful, elegant, and emotionally rich.
          - It must be under 120 characters.
          - No emojis, hashtags, or formatting.
          - No clichés like "follow your dreams".
        `,
        temperature: 1.1,
      },
    });

    return response.text?.trim() || "Your story is brighter than you think.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating note. But your light still shines!";
  }
};