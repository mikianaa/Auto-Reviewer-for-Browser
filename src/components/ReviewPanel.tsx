import React, { useState } from "react";
import PersonaForm from "./PersonaForm";
import ReviewResult from "./ReviewResult";

const ReviewPanel = () => {
    const [result, setResult] = useState("");

    // 仮のsubmitハンドラ
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setResult("（ここにAIレビュー結果が表示されます）");
    };

    return (
        <div style={{ width: 350, padding: 16 }}>
            <form onSubmit={handleSubmit}>
                <PersonaForm />
                <button type="submit" style={{ marginTop: 8 }}>レビュー生成</button>
            </form>
            <ReviewResult result={result} />
        </div>
    );
};

export default ReviewPanel; 