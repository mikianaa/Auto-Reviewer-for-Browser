import { useEffect } from "react"
import { useSettingStore } from "../services/settingsService"
import type { Settings, LLMModel } from "../types/settings"

export const useSettings = () => {
    const settings = useSettingStore(s => s.settings)
    const isLoading = useSettingStore(s => s.isLoading)
    const getSettings = useSettingStore(s => s.getSettings)
    const updateSettings = useSettingStore(s => s.updateSettings)
    const updateModel = useSettingStore(s => s.updateModel)
    const setCurrentModel = useSettingStore(s => s.setCurrentModel)

    useEffect(() => {
        getSettings()
    }, [getSettings])

    const currentModel = settings.models.find(m => m.id === settings.currentModelId)
    const hasModels = settings.models.length > 0

    const updateSettingsWithErrorHandling = async (updatedSettings: Partial<Settings>) => {
        try {
            await updateSettings(updatedSettings)
            console.log('Settings updated successfully')
        } catch (error) {
            console.error('Failed to update settings:', error)
            throw error
        }
    }

    const updateModelWithErrorHandling = async (modelId: number, updated: Partial<LLMModel>) => {
        try {
            await updateModel(modelId, updated)
            console.log('Model updated successfully')
        } catch (error) {
            console.error('Failed to update model:', error)
            throw error
        }
    }

    const setCurrentModelWithErrorHandling = async (modelId: number) => {
        try {
            await setCurrentModel(modelId)
            console.log('Current model set successfully')
        } catch (error) {
            console.error('Failed to set current model:', error)
            throw error
        }
    }

    return {
        settings,
        currentModel,
        isLoading,
        hasModels,
        updateSettings: updateSettingsWithErrorHandling,
        updateModel: updateModelWithErrorHandling,
        setCurrentModel: setCurrentModelWithErrorHandling,
    }
} 