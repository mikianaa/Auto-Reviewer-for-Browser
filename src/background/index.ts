chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "plasmo-review-selection",
        title: "選択テキストをレビュー",
        contexts: ["editable"]
    })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "plasmo-review-selection" && tab?.id) {
        chrome.tabs.sendMessage(tab.id, { type: "plasmo-review-selection" })
    }
})
