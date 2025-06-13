import { useState, useEffect } from "react"
import type { Persona } from "../types/persona"
import "../styles/modal.css"
import PrimaryButton from "./PrimaryButton"

interface PersonaModalProps {
    mode: "create" | "edit"
    persona?: Persona
    onSave: (updated: Persona) => void
    onClose: () => void
}

export default function PersonaModal({ mode, persona, onSave, onClose }: PersonaModalProps) {
    const isEdit = mode === "edit"

    const [form, setForm] = useState<Omit<Persona, "id">>({
        name: "",
        role: "",
        goal: "",
        interests: "",
        hobbies: ""
    })

    useEffect(() => {
        if (isEdit && persona) {
            setForm({
                name: persona.name,
                role: persona.role,
                goal: persona.goal,
                interests: persona.interests,
                hobbies: persona.hobbies
            })
        } else {
            setForm({
                name: "",
                role: "",
                goal: "",
                interests: "",
                hobbies: ""
            })
        }
    }, [isEdit, persona])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isEdit && persona) {
            onSave({ ...persona, ...form })
        } else {
            onSave({
                id: crypto.randomUUID(),
                ...form
            })
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="modal-title">{isEdit ? "読者編集" : "読者登録"}</h2>
                    <button
                        type="button"
                        className="modal-close-btn"
                        aria-label="閉じる"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="modal-form-group">
                        <label className="modal-label" htmlFor="persona-name">
                            名前 <span className="required-asterisk">*</span>
                        </label>
                        <input id="persona-name" name="name" className="modal-input" placeholder="名前を入力" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="modal-form-group">
                        <label className="modal-label" htmlFor="persona-goal">
                            目標 <span className="required-asterisk">*</span>
                        </label>
                        <input id="persona-goal" name="goal" className="modal-input" placeholder="目標を入力" value={form.goal} onChange={handleChange} required />
                    </div>
                    <div className="modal-form-group">
                        <label className="modal-label" htmlFor="persona-role">役割</label>
                        <input id="persona-role" name="role" className="modal-input" placeholder="役割を入力" value={form.role} onChange={handleChange} />
                    </div>

                    <div className="modal-form-group">
                        <label className="modal-label" htmlFor="persona-interests">関心事</label>
                        <input id="persona-interests" name="interests" className="modal-input" placeholder="関心事を入力" value={form.interests} onChange={handleChange} />
                    </div>
                    <div className="modal-form-group">
                        <label className="modal-label" htmlFor="persona-hobbies">趣味</label>
                        <input id="persona-hobbies" name="hobbies" className="modal-input" placeholder="趣味を入力" value={form.hobbies} onChange={handleChange} />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="modal-cancel" onClick={onClose}>キャンセル</button>
                        <PrimaryButton type="submit" size="small" className="modal-submit">
                            {isEdit ? "保存" : "登録"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    )
}
