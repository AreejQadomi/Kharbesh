// Adding popup icon (bubble) to the top of the page
let bubbleDOM = document.createElement('img');
initiateSelectionBubble();

// To receive any message from other scripts
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.callFunction) {
            case "highlightSelection":
                if (highlightSelection()) {
                    //deselect text after highlighting it
                    window.getSelection().removeAllRanges();
                    sendResponse({msg: "highlighted"});
                } else {
                    sendResponse({msg: "noSelection"});
                }
                break;

            case "showPencil":
                sendResponse({msg: "soon :)"});
                break;
        }
    });

function highlightSelection() {
    if (window.getSelection().toString()) {
        let selectionRange = window.getSelection().getRangeAt(0);
        //Please refer to https://stackoverflow.com/a/12823606 - get safe ranges for the word
        //Error: Failed to execute 'surroundContents' on 'Range': The Range has partially selected a non-Text node.
        //Discover more later
        let safeRanges = getSafeRanges(selectionRange);
        for (let i = 0; i < safeRanges.length; i++) {
            highlightRange(safeRanges[i]);
        }
        return true;
    } else {
        return false;
    }
}

function highlightRange(range) {
    let highlightNode = document.createElement("div");
    highlightNode.style.backgroundColor = '#FFFF00';
    highlightNode.style.display = 'inline';
    range.surroundContents(highlightNode);
}

function getSafeRanges(dangerous) {
    let xm = document.createRange();
    let a = dangerous.commonAncestorContainer;
    // Starts -- Work inward from the start, selecting the largest safe range
    let s = new Array(0), rs = new Array(0);
    if (dangerous.startContainer !== a)
        for (let i = dangerous.startContainer; i !== a; i = i.parentNode)
            s.push(i)
            ;
    if (0 < s.length) for (let i = 0; i < s.length; i++) {
        let xs = document.createRange();
        if (i) {
            xs.setStartAfter(s[i - 1]);
            xs.setEndAfter(s[i].lastChild);
        }
        else {
            xs.setStart(s[i], dangerous.startOffset);
            xs.setEndAfter(
                (s[i].nodeType === Node.TEXT_NODE)
                    ? s[i] : s[i].lastChild
            );
        }
        rs.push(xs);
    }

    // Ends -- basically the same code reversed
    let e = new Array(0), re = new Array(0);
    if (dangerous.endContainer !== a)
        for (let i = dangerous.endContainer; i !== a; i = i.parentNode)
            e.push(i)
            ;
    if (0 < e.length) for (let i = 0; i < e.length; i++) {
        let xe = document.createRange();
        if (i) {
            xe.setStartBefore(e[i].firstChild);
            xe.setEndBefore(e[i - 1]);
        }
        else {
            xe.setStartBefore(
                (e[i].nodeType === Node.TEXT_NODE)
                    ? e[i] : e[i].firstChild
            );
            xe.setEnd(e[i], dangerous.endOffset);
        }
        re.unshift(xe);
    }

    // Middle -- the uncaptured middle
    if ((0 < s.length) && (0 < e.length)) {
        xm.setStartAfter(s[s.length - 1]);
        xm.setEndBefore(e[e.length - 1]);
    }
    else {
        return [dangerous];
    }

    // Concat
    rs.push(xm);
    // Send to Console
    return rs.concat(re);
}

// To show popup icon (bubble) after text selection
// TODO 1- Enhancement on detecting mouse position more accurately.
// TODO 2- Solve the issue when clicking on selected text to deselect it, selectionRange is not updated.
document.addEventListener("mouseup", function (e) {
    if(window.getSelection().toString().length > 0 && window.getSelection().toString() !== "") {
        renderBubble(e.clientX, e.clientY);
    } else {
        // Hide the bubble if no text is selected
        bubbleDOM.style.visibility = 'hidden';
        bubbleDOM.style.display = 'none';
    }
});

// document.addEventListener("click", function (e) {
//     if(window.getSelection().toString().length <= 0) {
//         bubbleDOM.style.visibility = 'hidden';
//         bubbleDOM.style.display = 'none';
//     }
// });

//To hide popup icon (bubble) when deselecting text
// document.addEventListener("mousedown", function () {
//     if(!window.getSelection().toString()) {
//         bubbleDOM.style.visibility = 'hidden';
//     }
// });

function initiateSelectionBubble() {
    bubbleDOM.setAttribute('class', 'selection_bubble');
    bubbleDOM.src = chrome.extension.getURL("images/highlighter.png");
    bubbleDOM.style.width = '20px';
    bubbleDOM.style.height = '20px';
    bubbleDOM.style.visibility = 'hidden';
    bubbleDOM.style.display = 'none';
    bubbleDOM.style.position= 'absolute';
    document.body.appendChild(bubbleDOM);
}

// Move the selection bubble to the appropriate location.
function renderBubble(mouseX, mouseY) {
    bubbleDOM.style.top = mouseY + 'px';
    bubbleDOM.style.left = mouseX + 'px';
    bubbleDOM.style.display = 'inline';
    bubbleDOM.style.visibility = 'visible';
}

// Handle "Highlight" option from popup Icon
$(".selection_bubble").click(function () {
    console.log("test");
    highlightSelection();
    bubbleDOM.style.visibility = 'hidden';
    //deselect text after highlighting it
    window.getSelection().removeAllRanges();
});