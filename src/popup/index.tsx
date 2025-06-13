import { useState } from "react"
import PersonaForm from "../pages/PersonaForm"
import ReviewHistory from "../pages/ReviewHistory"
import SettingsPanel from "../pages/SettingsPanel"
import "../styles/popup.css"

export default function Popup() {
    const tabs = [
        { id: "persona", label: "読者" },
        { id: "history", label: "履歴" },
        { id: "settings", label: "設定" },
    ]

    const [activeTab, setActiveTab] = useState("persona")

    const renderTab = () => {
        switch (activeTab) {
            case "persona":
                return <PersonaForm />
            case "history":
                return <ReviewHistory />
            case "settings":
                return <SettingsPanel />
            default:
                return null
        }
    }

    return (
        <div className="popup-container">
            <div className="popup-tab-header">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`popup-tab-button ${activeTab === tab.id ? "active" : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="popup-tab-body">{renderTab()}</div>
        </div>
    )
}
