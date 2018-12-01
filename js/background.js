chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    "id": "mainContextMenu",
    "title": "Kharbesh",
    "contexts": ["selection"]
  });
  chrome.contextMenus.create({
    "id": "highlightContextMenu",
    "parentId": "mainContextMenu",
    "title": "Highlight text",
    "contexts": ["selection"]
  });
});

// handle "Highlight" option from context menu
chrome.contextMenus.onClicked.addListener(function(clickData) {
  if(clickData.menuItemId === "highlightContextMenu" && clickData.selectionText){
   // chrome.tabs.executeScript(null, {file: "content.js"});
  }
});