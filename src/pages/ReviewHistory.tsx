import { useState, useEffect } from "react"
import { useReview } from "../hooks/useReview"
import ConfirmDialog from "../components/ConfirmDialog"
import "../styles/reviewHistory.css"

export default function ReviewHistory() {
    const { removeReview, clearAllReviews, loadReviews, isLoadingReviews, reviews } = useReview()
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
    const [clearAllConfirm, setClearAllConfirm] = useState(false)

    useEffect(() => {
        loadReviews()
    }, [])

    const handleSelect = (id: string) => {
        setSelectedId(id === selectedId ? null : id)
    }

    const handleDeleteClick = (id: string) => {
        setDeleteConfirm(id)
    }

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm) return
        try {
            await removeReview(deleteConfirm)
            setDeleteConfirm(null)
            if (selectedId === deleteConfirm) setSelectedId(null)
        } catch (error) {
            console.error('Failed to delete review:', error)
        }
    }

    const handleDeleteCancel = () => {
        setDeleteConfirm(null)
    }

    const handleClearAllClick = () => {
        setClearAllConfirm(true)
    }

    const handleClearAllConfirm = async () => {
        try {
            await clearAllReviews()
            setClearAllConfirm(false)
            setSelectedId(null)
        } catch (error) {
            console.error('Failed to clear all reviews:', error)
        }
    }

    const handleClearAllCancel = () => {
        setClearAllConfirm(false)
    }

    const deleteTargetReview = deleteConfirm
        ? reviews.find(r => r.id === deleteConfirm)
        : null

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            return date.toLocaleString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return dateString
        }
    }

    if (isLoadingReviews) {
        return (
            <div className="review-history-container">
                <h2 className="review-history-heading">レビュー履歴</h2>
                <p>読み込み中...</p>
            </div>
        )
    }

    return (
        <div className="review-history-container">
            <div className="review-history-header">
                <h2 className="review-history-heading">レビュー履歴</h2>
                {reviews.length > 0 && (
                    <button
                        className="review-history-clear-all-button"
                        onClick={handleClearAllClick}
                    >
                        全履歴削除
                    </button>
                )}
            </div>

            {reviews.length === 0 ? (
                <p className="review-history-empty">履歴がありません。</p>
            ) : (
                <ul className="review-history-list">
                    {reviews.map((item) => (
                        <li
                            key={item.id}
                            className={
                                selectedId === item.id
                                    ? "review-history-item review-history-item-selected"
                                    : "review-history-item"
                            }
                        >
                            <div className="review-history-item-header">
                                <div>
                                    <strong className="review-history-item-title">{item.summary}</strong>
                                    <div className="review-history-item-date">{formatDate(item.createdAt)}</div>
                                    <div className="review-history-item-text">
                                        {item.selectedText.length > 50
                                            ? `${item.selectedText.substring(0, 50)}...`
                                            : item.selectedText
                                        }
                                    </div>
                                </div>
                                <div className="review-history-button-group">
                                    <button
                                        className="review-history-detail-button"
                                        onClick={() => handleSelect(item.id)}
                                    >
                                        {selectedId === item.id ? "閉じる" : "詳細"}
                                    </button>
                                    <button
                                        className="review-history-delete-button"
                                        onClick={() => handleDeleteClick(item.id)}
                                    >
                                        削除
                                    </button>
                                </div>
                            </div>
                            {selectedId === item.id && (
                                <div className="review-history-detail">
                                    <div className="review-history-detail-section">
                                        <h4>選択テキスト</h4>
                                        <p>{item.selectedText}</p>
                                    </div>
                                    <div className="review-history-detail-section">
                                        <h4>要約</h4>
                                        <p>{item.summary}</p>
                                    </div>
                                    <div className="review-history-detail-section">
                                        <h4>詳細</h4>
                                        <p>{item.detail}</p>
                                    </div>
                                    {item.annotations && item.annotations.length > 0 && (
                                        <div className="review-history-detail-section">
                                            <h4>注釈</h4>
                                            <ul>
                                                {item.annotations.map((annotation, index) => (
                                                    <li key={index}>
                                                        <strong>{item.selectedText.substring(annotation.start, annotation.end)}</strong>: {annotation.comment}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <ConfirmDialog
                isOpen={!!deleteConfirm}
                title="削除確認"
                message={deleteTargetReview
                    ? `このレビューを削除してもよろしいですか？\n\n要約: ${deleteTargetReview.summary}`
                    : "このレビューを削除してもよろしいですか？"
                }
                confirmText="削除"
                cancelText="キャンセル"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                type="delete"
            />

            <ConfirmDialog
                isOpen={clearAllConfirm}
                title="全履歴削除確認"
                message={`すべてのレビュー履歴を削除してもよろしいですか？\n\n件数: ${reviews.length}件\n\nこの操作は取り消せません。`}
                confirmText="全削除"
                cancelText="キャンセル"
                onConfirm={handleClearAllConfirm}
                onCancel={handleClearAllCancel}
                type="delete"
            />
        </div>
    )
} 