import React from "react"
import "../styles/modal.css"

interface ConfirmDialogProps {
    isOpen: boolean
    title?: string
    message: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
    onCancel: () => void
    type?: "delete" | "warning" | "info"
}

export default function ConfirmDialog({
    isOpen,
    title = "確認",
    message,
    confirmText = "確認",
    cancelText = "キャンセル",
    onConfirm,
    onCancel,
    type = "delete"
}: ConfirmDialogProps) {
    if (!isOpen) return null

    const getConfirmButtonClass = () => {
        switch (type) {
            case "delete":
                return "modal-delete"
            case "warning":
                return "modal-warning"
            default:
                return "modal-confirm"
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                </div>
                <div className="modal-content">
                    <p>{message}</p>
                </div>
                <div className="modal-actions">
                    <button
                        type="button"
                        className="modal-cancel"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className={getConfirmButtonClass()}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
} 