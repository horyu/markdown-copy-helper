import markdownit from 'markdown-it'

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    chrome.runtime.onMessage.addListener(
      (request: { type: string; text: string }, sender, sendResponse) => {
        if (request.type === "renderAndCopy") {
          renderAndCopy(request.text).catch((error) => {
            console.error("Failed to write text to clipboard:", error);
          });
        }
      }
    );
  },
});

function renderAndCopy(text: string): Promise<void> {
  const typePlain = "text/plain";
  const typeHtml = "text/html";
  const items = {
    [typePlain]: new Blob([text], { type: typePlain }),
    [typeHtml]: new Blob([renderMarkdown(text)], { type: typeHtml }),
  };
  const data = [new ClipboardItem(items)];

  return navigator.clipboard.write(data);
}

function renderMarkdown(text: string): string {
  return markdownit().render(text);
}
