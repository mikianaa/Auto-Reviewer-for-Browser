import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Persona } from "../types/persona"

interface PersonaState {
    personas: Persona[]
    currentId?: string
    setCurrentId: (id: string) => void
}

export const usePersonaStore = create<PersonaState>()(
    persist(
        (set) => ({
            personas: [
                {
                    id: "1",
                    name: "Biology Professor",
                    role: "Reviewer",
                    goal: "Find interesting research in an interdisciplinary domain",
                    interests: "Evolutionary Biology, academic research",
                    hobbies: "Reading research paper with industry impact"
                }
            ],
            currentId: "1",
            setCurrentId: (id) => set({ currentId: id })
        }),
        { name: "persona-storage" }
    )
)