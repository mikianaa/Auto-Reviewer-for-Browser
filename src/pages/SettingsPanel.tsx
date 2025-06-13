import { useState } from "react"
import "../styles/settingsPanel.css"
import PrimaryButton from "../components/PrimaryButton"
import { useSettings } from "../hooks/useSettings"


export default function SettingPanel() {
    const { settings, updateSettings, updateModel } = useSettings()
    const [saved, setSaved] = useState(false)

    const handleApiKeyChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (settings.currentModelId) {
            await updateModel(settings.currentModelId, { apiKey: e.target.value })
            setSaved(false)
        }
    }

    const handleSettingsChange = async (
        e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
        const { name, value } = e.target
        await updateSettings({ [name]: value })
        setSaved(false)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaved(true)
    }

    const handleClearApiKey = async () => {
        if (settings.currentModelId) {
            await updateModel(settings.currentModelId, { apiKey: "" })
            setSaved(false)
        }
    }

    const currentModel = settings.models.find(m => m.id === settings.currentModelId)

    return (
        <div className="settings-panel">
            <div className="settings-header">
                <h2 className="settings-title">拡張機能の設定</h2>
            </div>
            <form onSubmit={handleSave} className="settings-form">
                <section>
                    <label htmlFor="apikey" className="settings-label">
                        OpenAI APIキー
                    </label>
                    <input
                        id="apikey"
                        type="password"
                        value={currentModel?.apiKey || ""}
                        onChange={handleApiKeyChange}
                        placeholder="sk-..."
                        className="settings-input"
                        autoComplete="off"
                    />
                    <button type="button" onClick={handleClearApiKey} className="clear-button">
                        APIキーをクリア
                    </button>
                    <div className="settings-note">
                        OpenAIのAPIキーをここに入力してください。キーはローカルにのみ保存されます。
                    </div>
                </section>

                <section>
                    <label htmlFor="language" className="settings-label">
                        言語
                    </label>
                    <select
                        id="language"
                        name="language"
                        value={settings.language}
                        onChange={handleSettingsChange}
                        className="settings-input"
                    >
                        <option value="ja">日本語</option>
                        <option value="en">English</option>
                    </select>
                </section>

                <section>
                    <label className="settings-label">テーマ</label>
                    <div className="theme-options">
                        <label>
                            <input
                                type="radio"
                                name="theme"
                                value="light"
                                checked={settings.theme === "light"}
                                onChange={handleSettingsChange}
                            />
                            ライト
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="theme"
                                value="dark"
                                checked={settings.theme === "dark"}
                                onChange={handleSettingsChange}
                            />
                            ダーク
                        </label>
                    </div>
                </section>

                <PrimaryButton type="submit">保存</PrimaryButton>
                {saved && <div className="saved-message">設定を保存しました</div>}
            </form>

            <div className="settings-footer">
                ※ APIキーはこの端末のローカルストレージにのみ保存されます。<br />
                ※ 拡張機能の設定は今後追加予定です。
            </div>
        </div>
    )
} 