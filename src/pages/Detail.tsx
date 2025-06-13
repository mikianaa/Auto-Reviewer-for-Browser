import { useEffect, useState, useRef } from "react";
import "../styles/detail.css"
import { usePersonas } from "../hooks/usePersonas"
import CloseButton from "../components/CloseButton"
import type { Review } from "../types/review"
import { PersonaReviewTab, type PersonaReviewTabRef } from "../components/PersonaReviewTab"

export default function Detail({ review: initialReview, onClose }: { review: Review, onClose?: () => void }) {
    const { personas, defaultPersona, isLoading: personasLoading } = usePersonas()
    const [currentPersonaId, setCurrentPersonaId] = useState<string | undefined>(defaultPersona?.id)
    const [loadingTabs, setLoadingTabs] = useState<string[]>([])
    const [activeAnnotationIndex, setActiveAnnotationIndex] = useState<number | undefined>(undefined);

    const tabRefs = useRef<{ [personaId: string]: PersonaReviewTabRef }>({})

    const currentPersona = personas.find(p => p.id === currentPersonaId) || defaultPersona
    const isCurrentTabLoading = loadingTabs.includes(currentPersonaId || '')

    useEffect(() => {
        if (defaultPersona?.id && !currentPersonaId) {
            setCurrentPersonaId(defaultPersona.id)
        }
    }, [defaultPersona?.id, currentPersonaId])

    const handleReReview = () => {
        if (currentPersonaId && tabRefs.current[currentPersonaId]) {
            tabRefs.current[currentPersonaId].handleReReview()
        }
    };

    if (personasLoading) {
        return (
            <div className="detail-container modern-scale">
                <header className="detail-header">
                    <h2>レビュー</h2>
                    {onClose && (
                        <CloseButton onClick={onClose} size="small" />
                    )}
                </header>
                <main className="detail-main">
                    <div className="detail-loader">
                        <div className="loader"></div>
                        <p>初期化中...</p>
                    </div>
                </main>
            </div>
        )
    }

    if (!currentPersona) {
        return (
            <div className="detail-container modern-scale">
                <header className="detail-header">
                    <h2>レビュー</h2>
                    {onClose && (
                        <CloseButton onClick={onClose} size="small" />
                    )}
                </header>
                <main className="detail-main">
                    <div style={{ color: "#c00", textAlign: "center", padding: "2rem" }}>
                        <p>ペルソナが設定されていません</p>
                        <p style={{ fontSize: "14px", marginTop: "0.5rem" }}>
                            設定画面でペルソナを登録してください
                        </p>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="detail-container modern-scale">
            <header className="detail-header">
                <h2>{currentPersona.name} – レビュー</h2>
                <div className="detail-action-buttons">
                    <button
                        onClick={handleReReview}
                        disabled={!currentPersona || isCurrentTabLoading}
                        title="再レビュー"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                        </svg>
                    </button>
                    {onClose && (
                        <CloseButton onClick={onClose} size="small" />
                    )}
                </div>
            </header>

            <nav className="detail-persona-tab-header">
                {personas.map((p) => (
                    <button
                        key={p.id}
                        className={`detail-persona-tab-button ${p.id === currentPersona?.id ? "active" : ""}`}
                        onClick={() => {
                            setCurrentPersonaId(p.id)
                            setActiveAnnotationIndex(undefined)
                        }}
                    >
                        {p.name}
                        {loadingTabs.includes(p.id) && (
                            <span style={{ marginLeft: '4px', color: '#007acc' }}>●</span>
                        )}
                    </button>
                ))}
            </nav>

            <main className="detail-main detail-flex">
                {personas.map((persona) => (
                    <PersonaReviewTab
                        key={persona.id}
                        ref={(ref) => {
                            if (ref) tabRefs.current[persona.id] = ref
                        }}
                        persona={persona}
                        initialReview={persona.id === defaultPersona?.id ? initialReview : null}
                        originalSelectedText={initialReview.selectedText}
                        isVisible={persona.id === currentPersonaId}
                        activeAnnotationIndex={activeAnnotationIndex}
                        setActiveAnnotationIndex={setActiveAnnotationIndex}
                        onReviewStart={() => setLoadingTabs(prev => [...prev, persona.id])}
                        onReviewComplete={() => setLoadingTabs(prev => prev.filter(id => id !== persona.id))}
                    />
                ))}
            </main>
        </div>
    )
} 