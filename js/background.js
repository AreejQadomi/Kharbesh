chrome.runtime.onInstalled.addListener(function () {
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

// Handle "Highlight" option from context menu
chrome.contextMenus.onClicked.addListener(function (clickData) {
    if (clickData.menuItemId === "highlightContextMenu" && clickData.selectionText) {

        //Inject contentScript into background page
        chrome.tabs.executeScript({
            file: 'js/contentScript.js'
        });

        //send message to the injected script to execute the highlight function
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {callFunction: 'highlightSelection'});
        });
    }
});

// Get the initial color value
chrome.storage.sync.get('color', (values) => {
    let color = values.color ? values.color : "yellow";
    console.log(`highlight color is ${color}`);
    //chrome.contextMenus.update(color, {checked: true});
});