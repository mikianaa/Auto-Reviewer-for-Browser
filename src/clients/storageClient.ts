import type { Persona } from "../types/persona"
import type { Review } from "../types/review"
import type { Settings } from "../types/settings"
import { DEFAULT_SETTINGS } from "../types/settings"

export const storageClient = {
    async getPersonas(): Promise<Persona[]> {
        return new Promise((resolve) => {
            chrome.storage.sync.get(['personas'], (result) => {
                const personas = result.personas || [
                    {
                        id: "1",
                        name: "Biology Professor",
                        role: "Reviewer",
                        goal: "Find interesting research in an interdisciplinary domain",
                        interests: "Evolutionary Biology, academic research",
                        hobbies: "Reading research paper with industry impact"
                    },
                    {
                        id: "2",
                        name: "CS PhD Student",
                        role: "Research Assistant",
                        goal: "Evaluate technical clarity",
                        interests: "Systems, AI",
                        hobbies: "Hackathons"
                    },
                    {
                        id: "3",
                        name: "Editor",
                        role: "Editor",
                        goal: "Polish for readability",
                        interests: "Style, clarity",
                        hobbies: "Writing tips"
                    }
                ]
                resolve(personas)
            })
        })
    },

    async savePersonas(personas: Persona[]): Promise<void> {
        return new Promise((resolve) => {
            chrome.storage.sync.set({ personas }, () => {
                resolve()
            })
        })
    },

    async getDefaultPersonaId(): Promise<string> {
        return new Promise((resolve) => {
            chrome.storage.sync.get(['defaultPersonaId'], (result) => {
                resolve(result.defaultPersonaId || "1")
            })
        })
    },

    async saveDefaultPersonaId(id: string): Promise<void> {
        return new Promise((resolve) => {
            chrome.storage.sync.set({ defaultPersonaId: id }, () => {
                resolve()
            })
        })
    },

    async getReviews(): Promise<Review[]> {
        return new Promise((resolve) => {
            chrome.storage.local.get(['reviews'], (result) => {
                resolve(result.reviews || [])
            })
        })
    },

    async saveReviews(reviews: Review[]): Promise<void> {
        return new Promise((resolve) => {
            chrome.storage.local.set({ reviews }, () => {
                resolve()
            })
        })
    },

    async getSettings(): Promise<Settings> {
        return new Promise((resolve) => {
            chrome.storage.sync.get(['settings'], (result) => {
                resolve(result.settings || DEFAULT_SETTINGS)
            })
        })
    },

    async saveSettings(settings: Settings): Promise<void> {
        return new Promise((resolve) => {
            chrome.storage.sync.set({ settings }, () => {
                resolve()
            })
        })
    }
}