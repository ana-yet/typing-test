// The function is updated to use OpenRouter API instead of Gemini.
// It now reads OPENROUTER_API_KEY from the environment variables as requested by the user.
export async function generateTypingText(language: string, difficulty: string): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY; // Use the key specified by the user

    if (!apiKey) {
        console.error("OPENROUTER_API_KEY not configured in environment variables.");
        return "API key not found. Please ensure it's set. The quick brown fox jumps over the lazy dog.";
    }

    try {
        const prompt = `Generate a single, interesting paragraph in ${language} with a ${difficulty} difficulty level, suitable for a typing speed test. The paragraph should be around 40-60 words and contain standard punctuation. Do not wrap the output in quotes or add any introductory text.`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                // Optional headers for OpenRouter analytics
                "X-Title": "Typing Speed Test",
            },
            body: JSON.stringify({
                "model": "meta-llama/llama-4-maverick:free", 
                "messages": [
                    { "role": "user", "content": prompt }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content;

        if (!text) {
            throw new Error("Invalid response format from OpenRouter API.");
        }

        // Clean up potential formatting issues
        return text.trim().replace(/[\r\n]+/g, ' ').replace(/\s{2,}/g, ' ');

    } catch (error) {
        console.error("Error generating text from OpenRouter:", error);
        // Provide a fallback text in case of an API error
        return "The quick brown fox jumps over the lazy dog. Technology is reshaping our world, from how we communicate to how we work. Learning to type quickly and accurately is a valuable skill in the modern age.";
    }
}