import { useEffect } from "react"
import { usePersonaStore } from "../services/personaService"

export const usePersonas = () => {
    const personas = usePersonaStore(s => s.personas)
    const defaultPersonaId = usePersonaStore(s => s.defaultPersonaId)
    const defaultPersona = personas.find(p => p.id === defaultPersonaId)
    const isLoading = usePersonaStore(s => s.isLoading)
    const getPersonas = usePersonaStore(s => s.getPersonas)
    const addPersona = usePersonaStore(s => s.addPersona)
    const removePersona = usePersonaStore(s => s.removePersona)
    const updatePersona = usePersonaStore(s => s.updatePersona)
    const setDefaultPersona = usePersonaStore(s => s.setDefaultPersona)

    useEffect(() => {
        getPersonas()
    }, [getPersonas])


    const addPersonaWithErrorHandling = async (persona: import("../types/persona").Persona) => {
        try {
            await addPersona(persona)
            console.log('Persona added successfully')
        } catch (error) {
            console.error('Failed to add persona:', error)
            throw error
        }
    }

    const removePersonaWithErrorHandling = async (id: string) => {
        try {
            await removePersona(id)
            console.log('Persona removed successfully')
        } catch (error) {
            console.error('Failed to remove persona:', error)
            throw error
        }
    }

    const updatePersonaWithErrorHandling = async (id: string, updated: Partial<import("../types/persona").Persona>) => {
        try {
            await updatePersona(id, updated)
            console.log('Persona updated successfully')
        } catch (error) {
            console.error('Failed to update persona:', error)
            throw error
        }
    }

    const setDefaultPersonaWithErrorHandling = async (id: string) => {
        try {
            await setDefaultPersona(id)
            console.log('Default persona set successfully')
        } catch (error) {
            console.error('Failed to set default persona:', error)
            throw error
        }
    }

    return {
        personas,
        defaultPersona,
        isLoading,
        addPersona: addPersonaWithErrorHandling,
        removePersona: removePersonaWithErrorHandling,
        updatePersona: updatePersonaWithErrorHandling,
        setDefaultPersona: setDefaultPersonaWithErrorHandling,
    }
}