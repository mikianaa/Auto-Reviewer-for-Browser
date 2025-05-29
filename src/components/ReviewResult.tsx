import React from "react";

type ReviewResultProps = {
    result: string;
};

const ReviewResult: React.FC<ReviewResultProps> = ({ result }) => {
    return (
        <div style={{ whiteSpace: "pre-wrap", background: "#f9f9f9", padding: 12, borderRadius: 8, marginTop: 12 }}>
            {result || "ここにレビュー結果が表示されます"}
        </div>
    );
};

export default ReviewResult; 