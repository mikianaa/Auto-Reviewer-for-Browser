import type { ReactNode, CSSProperties } from "react"
import "../styles/closeButton.css"

interface CloseButtonProps {
    type?: "button" | "submit"
    onClick?: () => void
    children?: ReactNode
    size?: "small" | "medium" | "large"
    className?: string
    style?: CSSProperties
}

export default function CloseButton({
    type = "button",
    onClick,
    children = "✕",
    size = "medium",
    className = "",
    style
}: CloseButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`close-button close-button--${size} ${className}`.trim()}
            style={style}
            aria-label="閉じる"
        >
            {children}
        </button>
    )
}
