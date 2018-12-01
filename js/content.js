//highlight('yellow');

function highlight(color) {
    alert("highlight");
}

// to show popup after text is selected
document.body.addEventListener('mouseup', function() {

    if (window.getSelection()) {
        console.log(window.getSelection().toString());
    }
});