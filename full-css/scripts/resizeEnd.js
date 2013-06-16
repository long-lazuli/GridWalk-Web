/*
var setResizeEvents = function(){
	// Create the "resizeEnd" event on window.
*/


	$(window).on('resize', function() {
		if(this.resizeTO) 
			clearTimeout(this.resizeTO);
		this.resizeTO = setTimeout(function() {
			$(this).trigger('resizeEnd');
		}, 500);
	});


/*
	// instance return;
	return this;
};
*/