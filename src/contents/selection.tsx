const injectButton = () => {
    if (document.getElementById("plasmo-review-btn")) return
    const btn = document.createElement("button")
    btn.id = "plasmo-review-btn"
    btn.textContent = "レビュー"
    btn.style.cssText =
        "position:fixed;bottom:20px;right:20px;padding:8px 12px;border-radius:6px;background:#2563eb;color:#fff;z-index:9999;"
    btn.onclick = () => {
        chrome.runtime.sendMessage({ type: "plasmo-open-popup" })
    }
    document.body.appendChild(btn)
}

document.addEventListener("selectionchange", () => {
    const sel = document.getSelection()?.toString().trim()
    if (sel) injectButton()
})

export default null