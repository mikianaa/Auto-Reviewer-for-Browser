import React from "react";

const PersonaForm = () => {
    return (
        <form style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label>
                ペルソナ
                <input type="text" name="persona" placeholder="例: 厳格な編集者" />
            </label>
            <label>
                制約
                <input type="text" name="constraint" placeholder="例: 丁寧語のみ" />
            </label>
            <label>
                プロンプト
                <textarea name="prompt" placeholder="追加の指示や文脈"></textarea>
            </label>
            <button type="submit">レビュー生成</button>
        </form>
    );
};

export default PersonaForm; 