chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "encode",
      title: "Encode to Base64",
      contexts: ["selection"]
    });
  
    chrome.contextMenus.create({
      id: "decode",
      title: "Decode from Base64",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "encode" || info.menuItemId === "decode") {
      chrome.tabs.sendMessage(tab.id, {
        action: info.menuItemId,
        selectedText: info.selectionText
      });
    }
  });
  