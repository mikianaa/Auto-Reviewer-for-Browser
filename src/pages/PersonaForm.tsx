import { useState } from "react"
import type { Persona } from "../types/persona"
import { usePersonas } from "../hooks/usePersonas"
import PersonaModal from "../components/PersonaModal"
import ConfirmDialog from "../components/ConfirmDialog"
import "../styles/personaForm.css"
import PrimaryButton from "../components/PrimaryButton"

export default function PersonaForm() {
    const { personas, addPersona, updatePersona, removePersona } = usePersonas()

    const [isModalOpen, setModalOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<Persona | null>(null)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    const openNewModal = () => {
        setEditTarget(null)
        setMode("create")
        setModalOpen(true)
    }

    const openEditModal = (persona: Persona) => {
        setEditTarget(persona)
        setMode("edit")
        setModalOpen(true)
    }

    const handleSave = async (persona: Persona) => {
        try {
            if (mode === "edit" && editTarget) {
                await updatePersona(editTarget.id, persona)
            } else {
                await addPersona(persona)
            }
            setModalOpen(false)
            setEditTarget(null)
        } catch (error) {
            console.error('Failed to save persona:', error)
        }
    }

    const handleDeleteClick = (personaId: string) => {
        setDeleteConfirm(personaId)
    }

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm) return
        try {
            await removePersona(deleteConfirm)
            setDeleteConfirm(null)
        } catch (error) {
            console.error('Failed to delete persona:', error)
        }
    }

    const handleDeleteCancel = () => {
        setDeleteConfirm(null)
    }

    const deleteTargetName = deleteConfirm
        ? personas.find(p => p.id === deleteConfirm)?.name || ""
        : ""

    return (
        <div className="persona-container">
            <div>
                <h2 className="persona-heading">読者一覧</h2>
                {personas.length === 0 ? (
                    <p className="persona-empty">まだ読者が登録されていません。</p>
                ) : (
                    <div className="persona-card-grid">
                        {personas.map((p) => (
                            <div key={p.id} className="persona-card">
                                <h4>{p.name}</h4>
                                <small>{p.role}</small>
                                <div className="persona-card-actions">
                                    <button onClick={() => openEditModal(p)}>編集</button>
                                    <button
                                        onClick={() => handleDeleteClick(p.id)}
                                        className="delete-button"
                                    >
                                        削除
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={!!deleteConfirm}
                title="削除確認"
                message={`この読者を削除してもよろしいですか？\n${deleteTargetName}`}
                confirmText="削除"
                cancelText="キャンセル"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                type="delete"
            />

            {isModalOpen && (
                <PersonaModal
                    mode={mode}
                    persona={editTarget}
                    onClose={() => {
                        setModalOpen(false)
                        setEditTarget(null)
                    }}
                    onSave={handleSave}
                />
            )}
            <div className="persona-register-button-wrapper">
                <PrimaryButton size="small" onClick={openNewModal}>読者を登録</PrimaryButton>
            </div>

        </div>
    )
} 