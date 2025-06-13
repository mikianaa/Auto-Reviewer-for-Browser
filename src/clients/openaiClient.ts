export const openaiClient = {
    async fetchReview(
        systemPrompt: string,
        userPrompt: string,
        apiKey: string
    ): Promise<string> {
        if (!apiKey) {
            throw new Error("OpenAI API key is not set. Please set it in the settings panel.")
        }

        try {
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    temperature: 0.7
                })
            })

            if (!res.ok) {
                const error = await res.text()
                throw new Error(`OpenAI API error: ${error}`)
            }

            const data = await res.json()
            const content = data.choices?.[0]?.message?.content || ""
            return content
        } catch (error) {
            console.error("OpenAI API call failed:", error)
            throw error
        }
    }
} 