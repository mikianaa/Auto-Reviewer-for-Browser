import React from "react"
import type { Annotation } from "../types/anotation"

interface Props {
    text: string
    annotations: Annotation[]
    activeIndex?: number
    onAnnotationClick?: (index: number) => void
}

export const TextWithAnnotations: React.FC<Props> = ({ text, annotations, activeIndex, onAnnotationClick }) => {
    if (!annotations || annotations.length === 0) {
        return <span>{text}</span>
    }

    const elements: React.ReactNode[] = []
    let lastIndex = 0
    annotations.forEach((ann, i) => {
        if (lastIndex < ann.start) {
            elements.push(<span key={lastIndex + '-plain'}>{text.slice(lastIndex, ann.start)}</span>)
        }
        elements.push(
            <span
                key={ann.start + '-ann'}
                className={`annotation${activeIndex === i ? ' active' : ''}`}
                style={{ borderBottom: '2px solid red', cursor: 'pointer', background: activeIndex === i ? '#ffeaea' : undefined }}
                onClick={() => onAnnotationClick?.(i)}
                title={ann.comment}
            >
                {text.slice(ann.start, ann.end)}
            </span>
        )
        lastIndex = ann.end
    })
    if (lastIndex < text.length) {
        elements.push(<span key={lastIndex + '-plain-end'}>{text.slice(lastIndex)}</span>)
    }

    return <span>{elements}</span>
} 