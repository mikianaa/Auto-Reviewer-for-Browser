export type Language = "ja" | "en"
export type Theme = "light" | "dark"

export interface LLMModel {
    id: number
    name: string
    apiKey: string
    // 将来的に追加予定のプロパティ
    // temperature?: number
    // maxTokens?: number
    // topP?: number
    // frequencyPenalty?: number
    // presencePenalty?: number
}

export interface Settings {
    language: Language
    theme: Theme
    models: LLMModel[]
    currentModelId: number
}

export const DEFAULT_SETTINGS: Settings = {
    language: "ja",
    theme: "light",
    models: [
        {
            id: 1,
            name: "gpt-3.5-turbo",
            apiKey: ""
        }
    ],
    currentModelId: 1
} 