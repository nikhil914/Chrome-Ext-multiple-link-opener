let links = [];
let currentIndex = 0;
const targetUrls = ["https://urlshortx.io", "https://linkshortx.in"];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openLinks") {
    links = request.links;
    currentIndex = 0;
    openNextLink();
  }
});

function openNextLink() {
  if (currentIndex >= links.length) {
    console.log("All links have been processed.");
    return;
  }

  const url = links[currentIndex];
  chrome.tabs.create({ url }, (tab) => {
    const tabId = tab.id;
    let timer = setTimeout(() => {
      proceedToNextLink(tabId);
    }, 30000);

    chrome.tabs.onUpdated.addListener(function listener(tabIdUpdated, info, tab) {
      if (tabIdUpdated === tabId && info.url && targetUrls.some(target => info.url.includes(target))) {
        clearTimeout(timer);
        chrome.tabs.onUpdated.removeListener(listener);
        proceedToNextLink(tabId);
      }
    });
  });
}

function proceedToNextLink(tabId) {
  chrome.tabs.onRemoved.addListener(function onTabClosed(closedTabId) {
    if (closedTabId === tabId) {
      chrome.tabs.onRemoved.removeListener(onTabClosed);
    }
  });
  currentIndex++;
  openNextLink();
}
