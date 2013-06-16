$(window).on('scroll', function(){
	if(window.location.hash)
		$(window).scrollLeft( 0 ).scrollTop( 0 );
});


$(function(){

	$(window).on('resizeEnd', function(){
		var H = window.innerHeight,
		 	W = window.innerWidth,
		 	minD = ( H <= W )? H : W,
		 	boxSize = $('.ui-box').is('[data-box-size]') ? $('.ui-box').data('box-size') : '60%';
			
		if( boxSize[boxSize.length -1] == "%"){
			boxSize = minD * parseInt( boxSize.substr( 0, boxSize.length -1 ), 10 ) / 100;
		}

		$('.ui-box').css({
			width:  boxSize,
			height: boxSize
		});

	});

// evenements :
	$('input').on("change", function(){
	  	var srcId = $(this).attr('id'),
	  		hash = '#'+srcId;
	  console.log('input change', hash);
		
		$('.ui-box > .ui-body > label[for="'+srcId+'"]').addClass('active').siblings('label').removeClass('active');
		
		if( window.location.hash !== hash)
			history.pushState( {}, window.title, hash );
	});


	window.onpopstate = function(event) {
	if(window.location.hash !== "" || window.location.hash !== "")
		$( 'input'+window.location.hash ).attr('checked', true);

	};


// calcule le nombre de colonnes et de lignes, servira après.
	var firstPos = {},
		lastPos = {};

	$('input').each(function(){
		var classes = this.className.split(/\s+/);
	  	for (var i = classes.length - 1; i >= 0; i--) {
		  	classPart = classes[i].split('-');
		  	classPart[2] = parseInt(classPart[2]);

		  	if( ! firstPos[classPart[1]] || firstPos[classPart[1]] > classPart[2] )
		  		firstPos[classPart[1]] = classPart[2];

		  	if( ! lastPos[classPart[1]] || lastPos[classPart[1]] < classPart[2] )
		  		lastPos[classPart[1]] = classPart[2];

		}
	});






// autogeneration des balises label :
	if( ! $('div.ui-body').length )	$('<div class="ui-body"></div>').appendTo('fieldset.ui-box');

	$('input').each(function(){
		var inputId = $(this).attr('id'),
			inputClasses = $(this).attr('class');
		if( ! $('label[for="'+inputId+'"]').length ){
			$('div.ui-body').append( '<label for="'+inputId+'">' );
		}
		$('label[for="'+inputId+'"]').addClass(inputClasses);
	});

	$('input:checked').trigger('change');







// La fonction JQuery pour passer d'un radio à l'autre :
	$.fn.changeTo = function(target){
		var	$target,
  			srcClasses = $(this).attr('class').split(/\s+/);
	  		srcName = $(this).attr('name'),
			srcPos = {};

	  	// on va regarder chacune des class du input qui reçoit l'evennement keydown
	  	for (var i = srcClasses.length - 1; i >= 0; i--) {
	  		var classPart = srcClasses[i].split('-');
		  	classPart[2] = parseInt(classPart[2]);
		  	// on stock la position du input
	  		srcPos[ classPart[1] ] = classPart[2];
	  	};

		switch( target ){
			case 'left':		$target = $('.ui-row-'+srcPos.row+'.ui-col-'+(srcPos.col -1));	break;
			case 'right':		$target = $('.ui-row-'+srcPos.row+'.ui-col-'+(srcPos.col +1));	break;
			case 'top':			$target = $('.ui-row-'+(srcPos.row -1)+'.ui-col-'+srcPos.col);	break;
			case 'bottom':		$target = $('.ui-row-'+(srcPos.row +1)+'.ui-col-'+srcPos.col);	break;

			case 'previous':	$target = $(this).prev('[name="'+srcName+'"]');	break;
			case 'next':		$target = $(this).next('[name="'+srcName+'"]');	break;
	
			case 'first':		$target = $('[name="'+srcName+'"]').first();	break;
			case 'last':		$target = $('[name="'+srcName+'"]').last();	break;
		}

	  	//console.log(srcName, srcPos, $target);
		$target.trigger('click');

	};






// le tricks du clavier
	$(document).on('keydown', function(e){
		// declaration
	  	var code = e.rkeyCode ? e.keyCode : e.which,
			target = false;

		//console.log(code);
	  	// selon la touche qui est appuyé, on fait quekchose :
	    switch(code){
			case 37:	target = 'left';		break;
			case 38:	target = 'top';			break;
			case 39:	target = 'right';		break;
			case 40:	target = 'bottom';		break;

			case 33:	target = 'previous';	break;// pageUp
			case 34:	target = 'next';		break;// pageDown

			case 36:	target = 'first';		break;// debut
			case 35:	target = 'last';		break;// end
		}

		// si on fait quekchose, on annule le comportement par défault:
		if(target){

			$('input:checked').changeTo(target);
			e.preventDefault();
			e.stopPropagation();
			return false;
		}

	});






	// Go on the right Layout at loading.
	$(window)
		.trigger('resizeEnd')
		.trigger('onpopstate');

});
