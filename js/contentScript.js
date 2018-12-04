// To receive any message from other scripts
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.callFunction) {
            case "highlightSelection":
                highlightSelection();
                break;
            case "showPencil":
                sendResponse({msg: "soon :)"});
                break;
        }
    });

function highlightSelection() {
    let selectionRange = window.getSelection().getRangeAt(0);
    //Please refer to https://stackoverflow.com/a/12823606 to get safe ranges for the word
    //let safeRanges = getSafeRanges(selectionRange);
    // for (let i = 0; i < safeRanges.length; i++) {
    //     highlightRange(safeRanges[i]);
    // }
    highlightRange(selectionRange);
}

function highlightRange(range) {
    let highlightNode = document.createElement("div");
    highlightNode.style.backgroundColor = '#FFFF00';
    highlightNode.style.display = 'inline';
    range.surroundContents(highlightNode);
}