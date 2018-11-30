highlight('yellow');

function highlight(color) {
    var range, sel;
    if (window.getSelection) {
        // IE9 and non-IE
        try {
            if (!document.execCommand("BackColor", false, color)) {
                makeEditableAndHighlight(color);
            }
        } catch (ex) {
            makeEditableAndHighlight(color)
        }
    } else if (document.selection && document.selection.createRange) {
        // IE <= 8 case
        range = document.selection.createRange();
        range.execCommand("BackColor", false, color);
    }
}