import markdownit from "markdown-it";

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    chrome.runtime.onMessage.addListener(
      (request: { type: string }, sender, sendResponse) => {
        if (request.type === "renderAndCopy") {
          const text = document.getSelection()?.toString();
          if (text) {
            renderAndCopy(text).catch((error) => {
              console.error("Failed to write text to clipboard:", error);
            });
          }
        }
      }
    );
  },
});

function renderAndCopy(text: string): Promise<void> {
  const typePlain = "text/plain";
  const typeHtml = "text/html";
  const blobParts = [renderMarkdown(text)];
  const items = {
    [typePlain]: new Blob(blobParts, { type: typePlain }),
    [typeHtml]: new Blob(blobParts, { type: typeHtml }),
  };
  const data = [new ClipboardItem(items)];

  return navigator.clipboard.write(data);
}

function renderMarkdown(text: string): string {
  return markdownit().render(text);
}
