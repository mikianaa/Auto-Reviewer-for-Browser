import type { ReactNode } from "react"
import "../styles/primaryButton.css"

interface PrimaryButtonProps {
    type?: "button" | "submit"
    onClick?: () => void
    children: ReactNode
    size?: "small" | "medium" | "large"
    className?: string
    style?: React.CSSProperties
}

export default function PrimaryButton({
    type = "button",
    onClick,
    children,
    size = "medium",
    className = "",
    style
}: PrimaryButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`save-button save-button--${size} ${className}`.trim()}
            style={style}
        >
            {children}
        </button>
    )
}
