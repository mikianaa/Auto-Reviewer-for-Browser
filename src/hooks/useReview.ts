// === src/hooks/useReview.ts ===
import { useState } from "react"
export const useReview = () => {
    const [isLoading, setLoading] = useState(false)
    const [data, setData] = useState<{ summary: string; score: number } | null>(
        null
    )

    const runReview = async (text: string) => {
        setLoading(true)
        // --- mock delay & data ---
        await new Promise((r) => setTimeout(r, 800))
        setData({ summary: "Clear and concise.", score: 4.3 })
        setLoading(false)
    }

    return { isLoading, data, runReview }
} 