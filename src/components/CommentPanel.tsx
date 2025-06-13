import React from "react"

interface Props {
    comment?: string
}

export const CommentPanel: React.FC<Props> = ({ comment }) => {
    return (
        <div className="comment-panel">
            <h3>AIコメント</h3>
            <div className="comment-content">
                {comment ? comment : <span style={{ color: '#aaa' }}>左の赤線をクリックしてください</span>}
            </div>
        </div>
    )
} 