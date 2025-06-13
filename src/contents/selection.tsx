import { computePosition, offset, flip, shift } from "@floating-ui/dom"
import { createRoot } from "react-dom/client"
import MiniPopup from "../pages/MiniPopup"
// import Detail from "../pages/Detail"
import miniPopupCssText from "data-text:../styles/miniPopup.css"
import detailCssText from "data-text:../styles/detail.css"
import closeButtonCssText from "data-text:../styles/closeButton.css"

let unmount: (() => void) | null = null

chrome.runtime.onMessage.addListener(async (msg) => {
    if (msg.type !== "plasmo-review-selection") return

    const sel = window.getSelection()
    if (!sel?.rangeCount) return
    const rect = sel.getRangeAt(0).getBoundingClientRect()

    const virtualEl = {
        getBoundingClientRect: () => rect,
        contextElement: document.body
    } as any

    unmount?.()
    unmount = null

    const host = document.createElement("div")
    Object.assign(host.style, {
        position: "fixed",
        pointerEvents: "none"
    })
    document.body.appendChild(host)

    const shadowRoot = host.attachShadow({ mode: "open" })

    const style = document.createElement("style")
    style.textContent = miniPopupCssText + "\n" + detailCssText + "\n" + closeButtonCssText
    shadowRoot.appendChild(style)

    const mountPoint = document.createElement("div")
    shadowRoot.appendChild(mountPoint)
    const root = createRoot(mountPoint)
    root.render(
        <MiniPopup
            selectedText={sel.toString()}
            onClose={() => {
                root.unmount()
                host.remove()
                unmount = null
            }}
        />
    )

    await new Promise((r) => requestAnimationFrame(r))

    const popupEl = shadowRoot.getElementById("popup-root") as HTMLElement
    popupEl.style.pointerEvents = "auto"

    const { x, y } = await computePosition(virtualEl, popupEl, {
        placement: "top",
        middleware: [
            offset(90),
            flip(),
            shift({ padding: 8 })
        ]
    })

    popupEl.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(
        y
    )
        }px, 0)`

    unmount = () => {
        root.unmount()
        host.remove()
    }
})

export default null