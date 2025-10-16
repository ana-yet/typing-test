
import { GoogleGenAI } from "@google/genai";

// Fix: Per coding guidelines, initialize GoogleGenAI directly with process.env.API_KEY and assume it is set.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Fix: Updated function to accept language and difficulty, and use them in the prompt.
export async function generateTypingText(language: string, difficulty: string): Promise<string> {
    try {
        const prompt = `Generate a single, interesting paragraph in ${language} with a ${difficulty} difficulty level, suitable for a typing speed test. The paragraph should be around 40-60 words and contain standard punctuation. Do not wrap the output in quotes or add any introductory text.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7,
                // Fix: Added thinkingConfig and adjusted maxOutputTokens per Gemini API guidelines for the 'gemini-2.5-flash' model.
                maxOutputTokens: 200,
                thinkingConfig: { thinkingBudget: 100 },
            }
        });

        let text = response.text.trim();

        // Clean up potential formatting issues
        text = text.replace(/[\r\n]+/g, ' ').replace(/\s{2,}/g, ' ');

        return text;
    } catch (error) {
        console.error("Error generating text from Gemini:", error);
        // Provide a fallback text in case of an API error
        return "The quick brown fox jumps over the lazy dog. Technology is reshaping our world, from how we communicate to how we work. Learning to type quickly and accurately is a valuable skill in the modern age.";
    }
}
