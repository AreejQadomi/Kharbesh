$(function () {

    //Inject contentScript into popup page
    chrome.tabs.executeScript({
        file: 'js/contentScript.js'
    });

    // Handle clicks on tools from popup

    $("#highlighter").click(function () {
        //send message to the injected script to execute the highlight function
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {callFunction: 'highlightSelection'}, function (response) {

                window.close();
                if (response.msg.toString() === "noSelection")
                    alert("Please select a text to highlight!");
            });
        });
    });

    // Expand highlighter colors list on right click
    $(document).on('contextmenu', '#highlighter', function () {
        $(".highlightColors").toggleClass("expandableColors");
        return false; // cancel default menu
    });

    $("#pencil").click(function () {
        //send message to the injected script to execute the show pencil function
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {callFunction: 'showPencil'}, function (response) {
                window.close();
                alert(response.msg);
            });
        });
    });
});