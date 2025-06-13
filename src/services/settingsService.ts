import { create } from "zustand"
import type { Settings, LLMModel } from "../types/settings"
import { DEFAULT_SETTINGS } from "../types/settings"
import { storageClient } from "../clients/storageClient"

interface SettingState {
    settings: Settings
    isLoading: boolean
    getSettings: () => Promise<void>
    updateSettings: (settings: Partial<Settings>) => Promise<void>
    updateModel: (modelId: number, updated: Partial<LLMModel>) => Promise<void>
    setCurrentModel: (modelId: number) => Promise<void>
}

export const useSettingStore = create<SettingState>()((set, get) => ({
    settings: DEFAULT_SETTINGS,
    isLoading: false,

    getSettings: async () => {
        set({ isLoading: true })
        try {
            const settings = await storageClient.getSettings()
            set({ settings })
        } catch (error) {
            console.error('Failed to load settings from storage:', error)
        } finally {
            set({ isLoading: false })
        }
    },

    updateSettings: async (updatedSettings: Partial<Settings>) => {
        const currentSettings = get().settings
        const newSettings = { ...currentSettings, ...updatedSettings }
        set({ settings: newSettings })

        try {
            await storageClient.saveSettings(newSettings)
        } catch (error) {
            // 失敗時はロールバック
            set({ settings: currentSettings })
            throw error
        }
    },

    updateModel: async (modelId: number, updated: Partial<LLMModel>) => {
        const currentSettings = get().settings
        const updatedModels = currentSettings.models.map(model =>
            model.id === modelId
                ? { ...model, ...updated }
                : model
        )
        const newSettings = { ...currentSettings, models: updatedModels }
        set({ settings: newSettings })

        try {
            await storageClient.saveSettings(newSettings)
        } catch (error) {
            // 失敗時はロールバック
            set({ settings: currentSettings })
            throw error
        }
    },

    setCurrentModel: async (modelId: number) => {
        const currentSettings = get().settings
        const newSettings = { ...currentSettings, currentModelId: modelId }
        set({ settings: newSettings })

        try {
            await storageClient.saveSettings(newSettings)
        } catch (error) {
            // 失敗時はロールバック
            set({ settings: currentSettings })
            throw error
        }
    }
})) 