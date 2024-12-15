export default defineBackground(() => {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "renderAndCopy",
      title: "Render Markdown ＆ Copy",
      contexts: ["selection"],
    });
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "renderAndCopy" && tab?.id) {
      chrome.tabs
        .sendMessage(tab.id, {
          type: "renderAndCopy",
          text: info.selectionText,
        })
        .catch((error) => console.error("Failed to send message:", error));
    }
  });
});
