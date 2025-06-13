import { create } from "zustand"
import type { Persona } from "../types/persona"
import { storageClient } from "~src/clients/storageClient"

interface PersonaState {
    personas: Persona[]
    defaultPersonaId?: string
    isLoading: boolean
    getPersonas: () => Promise<void>
    addPersona: (persona: Persona) => Promise<void>
    removePersona: (id: string) => Promise<void>
    updatePersona: (id: string, updated: Partial<Persona>) => Promise<void>
    setDefaultPersona: (id: string) => Promise<void>
}

export const usePersonaStore = create<PersonaState>()((set, get) => ({
    personas: [],
    defaultPersonaId: undefined,
    isLoading: false,

    getPersonas: async () => {
        set({ isLoading: true })
        try {
            const personas = await storageClient.getPersonas()
            const defaultPersonaId = await storageClient.getDefaultPersonaId()
            set({ personas, defaultPersonaId })
        } catch (error) {
            console.error('Failed to load personas from storage:', error)
        } finally {
            set({ isLoading: false })
        }
    },

    addPersona: async (persona: Persona) => {
        const currentPersonas = get().personas
        const newPersonas = [...currentPersonas, persona]
        set({ personas: newPersonas })

        try {
            await storageClient.savePersonas(newPersonas)
        } catch (error) {
            set({ personas: currentPersonas })
            throw error
        }
    },

    removePersona: async (id: string) => {
        const currentPersonas = get().personas
        const currentDefaultId = get().defaultPersonaId

        const newPersonas = currentPersonas.filter((p) => p.id !== id)
        const newDefaultId = currentDefaultId === id ? newPersonas[0]?.id : currentDefaultId

        set({ personas: newPersonas, defaultPersonaId: newDefaultId })

        try {
            await storageClient.savePersonas(newPersonas)
            if (newDefaultId !== currentDefaultId) {
                await storageClient.saveDefaultPersonaId(newDefaultId || "")
            }
        } catch (error) {
            set({ personas: currentPersonas, defaultPersonaId: currentDefaultId })
            throw error
        }
    },

    updatePersona: async (id: string, updated: Partial<Persona>) => {
        const currentPersonas = get().personas
        const newPersonas = currentPersonas.map((p) =>
            p.id === id ? { ...p, ...updated } : p
        )
        set({ personas: newPersonas })

        try {
            await storageClient.savePersonas(newPersonas)
        } catch (error) {
            set({ personas: currentPersonas })
            throw error
        }
    },

    setDefaultPersona: async (id: string) => {
        const currentDefaultId = get().defaultPersonaId
        set({ defaultPersonaId: id })

        try {
            await storageClient.saveDefaultPersonaId(id)
        } catch (error) {
            set({ defaultPersonaId: currentDefaultId })
            throw error
        }
    }
}))
