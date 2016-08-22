$(window).keypress(function(e) {

	e.preventDefault();

	// This works for most of the keyboard
	$('#console h2').text($('#console h2').text()+String.fromCharCode(e.keyCode));
	show(String.fromCharCode(e.keyCode));

});

function show(key) {
	console.log("Showing : "+key);
	$('#'+key).fadeOut();
}