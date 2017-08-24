
$(document).ready(function() {
	
});

var doit;
window.onresize = function () {
    clearTimeout(doit);
    doit = setTimeout(function () {
       // Resize function
    }, 500)

}