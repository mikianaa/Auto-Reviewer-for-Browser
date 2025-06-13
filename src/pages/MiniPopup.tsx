import "../styles/miniPopup.css"
import CloseButton from "../components/CloseButton"
import { useEffect, useState, useRef } from "react"
import { useReview } from "../hooks/useReview"
import { Loader } from "../components/Loader"
import Detail from "./Detail"
import { usePersonas } from "../hooks/usePersonas"

const MiniPopup = ({ selectedText, onClose }: { selectedText: string, onClose?: () => void }) => {
    const { isAddingReview, latestReview, addReview, error } = useReview()
    const [expanded, setExpanded] = useState(false)
    const { defaultPersona, isLoading: personasLoading } = usePersonas()
    const popupRootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("defaultPersona", defaultPersona)
        if (defaultPersona && !personasLoading) {
            void addReview(selectedText, defaultPersona)
        }
    }, [defaultPersona, personasLoading])

    useEffect(() => {
        if (expanded && popupRootRef.current) {
            const popupEl = popupRootRef.current;
            popupEl.style.position = "fixed";
            popupEl.style.left = "50%";
            popupEl.style.top = "30%";
            popupEl.style.transform = "translate(-55%, -45%)";
        }
    }, [expanded]);

    if (expanded && latestReview) {
        return (
            <div id="popup-root" ref={popupRootRef} className="z-[2147483647]">
                <Detail review={latestReview} onClose={onClose} />
            </div>
        )
    }

    const isLoadingState = personasLoading || isAddingReview

    return (
        <div id="popup-root" className="mini-popup">
            <div className="mini-popup-header">
                <span>
                    AIレビュー
                </span>
                {onClose && <CloseButton onClick={onClose} size="small" />}
            </div>

            <div className="mini-popup-body">
                {isLoadingState ? (
                    <div style={{ display: "flex", gap: "0.5rem", color: "#4b5563" }}>
                        <Loader />
                    </div>
                ) : error ? (
                    <>
                        <p className="summary-title" style={{ color: "#c00" }}>システムエラーが発生しました</p>
                        <div style={{ margin: "0.5rem", color: "#c00", background: "#fff0f0", padding: "0.5rem", borderRadius: "4px", fontSize: 13 }}>
                            {error}
                        </div>
                    </>
                ) : !defaultPersona ? (
                    <div style={{ color: "#c00", textAlign: "center", padding: "1rem" }}>
                        <p>読者が設定されていません</p>
                        <p style={{ fontSize: "12px", marginTop: "0.5rem" }}>
                            設定画面で読者を登録してください
                        </p>
                    </div>
                ) : latestReview ? (
                    <>
                        <p className="summary-title">要約</p>
                        <p className="summary">{latestReview.summary}</p>
                        <button className="button" onClick={() => setExpanded(true)}>詳細を見る</button>
                    </>
                ) : null}
            </div>
        </div>
    )
}

export default MiniPopup 