import type { Review } from "../types/review"
import type { Persona } from "../types/persona"
import type { Annotation } from "../types/anotation"
import { storageClient } from "~src/clients/storageClient"
import { openaiClient } from "~src/clients/openaiClient"

const createSystemPrompt = (persona: Persona): string => {
    return `あなたは優秀なレビュワーです。
このレビューでは、以下のペルソナになりきってください。

【ペルソナ情報】
名前: ${persona.name}
役割: ${persona.role}
目標: ${persona.goal}
興味: ${persona.interests}
趣味: ${persona.hobbies}

このペルソナの視点から、与えられたテキストをレビューし、
1. レビューの要約と添削の要点
2. 詳細なフィードバック
3. 添削が必要な箇所ごとに、問題のあるテキスト部分とコメントを含むJSON配列

**重要：添削箇所について**
- 問題のある具体的なテキスト部分（単語や句）を"phrase"として抽出してください
- そのテキスト部分に対するコメントを"comment"として記載してください
- phraseは元のテキストに存在する正確な文字列を指定してください

**出力フォーマット**
要約: [レビューの要約と添削の要点]
詳細: [詳細なフィードバック]
[{"phrase":"問題のあるテキスト部分","comment":"修正コメント"}]

**例**
テキスト："こんにちわ、元気ですか？"
[{"phrase":"ちわ","comment":"「ちわ」は「ちは」が正しい表記です。"}]

を日本語で返してください。`
}

const createUserPrompt = (selectedText: string): string => {
    return `レビュー対象テキスト:\n${selectedText}`
}

const parseReviewResponse = (content: string, selectedText: string): { summary: string; detail: string; annotations: Annotation[] } => {
    console.log("OpenAI response content:", content)

    try {
        const summaryMatch = content.match(/要約[:：](.*)/)
        const detailMatch = content.match(/詳細[:：]([\s\S]*?)(\[|$)/)
        const annotationsMatch = content.match(/(\[.*\])/s)

        const summary = summaryMatch ? summaryMatch[1].trim() : ""
        const detail = detailMatch ? detailMatch[1].trim() : ""
        let annotations: Annotation[] = []

        if (annotationsMatch) {
            try {
                const rawAnnotations = JSON.parse(annotationsMatch[1])
                annotations = rawAnnotations.map((ann: { phrase: string; comment: string }) => {
                    const startIndex = selectedText.indexOf(ann.phrase)
                    if (startIndex === -1) {
                        console.warn(`Phrase "${ann.phrase}" not found in text`)
                        return null
                    }
                    return {
                        start: startIndex,
                        end: startIndex + ann.phrase.length,
                        comment: ann.comment
                    }
                }).filter(Boolean)
            } catch (e) {
                console.error("Failed to parse annotations:", e)
                annotations = []
            }
        }

        const finalSummary = summary || "レビューの要約を取得できませんでした"
        const finalDetail = detail || "レビューの詳細を取得できませんでした"

        return { summary: finalSummary, detail: finalDetail, annotations }
    } catch (error) {
        console.error("Failed to parse review response:", error)

        return {
            summary: "レスポンスの解析に失敗しました",
            detail: `レスポンスの解析中にエラーが発生しました。\n\n元のレスポンス:\n${content}`,
            annotations: []
        }
    }
}

export const getReviews = async (): Promise<Review[]> => {
    try {
        const reviews = await storageClient.getReviews()
        const sortedReviews = reviews.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        console.log('Reviews loaded successfully')
        return sortedReviews
    } catch (error) {
        console.error('Failed to load reviews from storage:', error)
        throw error
    }
}

export const addReview = async (selectedText: string, persona: Persona): Promise<Review> => {
    try {
        const systemPrompt = createSystemPrompt(persona)
        const userPrompt = createUserPrompt(selectedText)

        const settings = await storageClient.getSettings()
        const currentModel = settings.models.find(m => m.id === settings.currentModelId)
        const apiKey = currentModel?.apiKey

        if (!apiKey || apiKey === "") {
            throw new Error("APIキーが設定されていません")
        }

        const rawResponse = await openaiClient.fetchReview(systemPrompt, userPrompt, apiKey)

        const { summary, detail, annotations } = parseReviewResponse(rawResponse, selectedText)

        const now = new Date().toISOString()
        const newReview: Review = {
            id: crypto.randomUUID(),
            selectedText,
            summary,
            detail,
            createdAt: now,
            annotations
        }

        const currentReviews = await storageClient.getReviews()
        const newReviews = [newReview, ...currentReviews]

        await storageClient.saveReviews(newReviews)
        return newReview
    } catch (error) {
        console.error('Failed to create review:', error)
        throw error
    }
}

export const removeReview = async (id: string): Promise<void> => {
    try {
        const currentReviews = await storageClient.getReviews()
        const newReviews = currentReviews.filter((review) => review.id !== id)
        await storageClient.saveReviews(newReviews)
    } catch (error) {
        console.error('Failed to remove review:', error)
        throw error
    }
}

export const clearAllReviews = async (): Promise<void> => {
    try {
        await storageClient.saveReviews([])
    } catch (error) {
        console.error('Failed to clear all reviews:', error)
        throw error
    }
}
