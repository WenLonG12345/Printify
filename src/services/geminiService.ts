import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAI = () => {
	if (!ai) {
		ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
	}
	return ai;
};

export const generateLoveNote = async (
	userPrompt?: string,
): Promise<string> => {
	const aiClient = getAI();

	// Fallback for empty key to prevent crash in dev if not set
	if (!process.env.API_KEY) {
		return "I love you more than code loves syntax! (Add API Key for more)";
	}

	const prompt = userPrompt
		? `Write a short, whimsical, and witty note based on this topic: "${userPrompt}". Keep it under 30 words. No formatting.`
		: "Write a short, sweet, and witty affirmation or thought. Under 20 words. No formatting.";

	try {
		const response = await aiClient.models.generateContent({
			model: "gemini-2.5-flash",
			contents: prompt,
			config: {
				systemInstruction:
					"You are a creative writer who writes succinct, charming notes for receipts.",
				temperature: 1.2, // High creativity
			},
		});

		return response.text?.trim() || "You are my favorite notification.";
	} catch (error) {
		console.error("Gemini API Error:", error);
		return "Error generating note. But I still love you!";
	}
};
