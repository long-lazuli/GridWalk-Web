$(window).on('scroll', function(){
	if(window.location.hash)
		$(window).off('scroll').scrollLeft( 0 ).scrollTop( 0 );
});


$(function(){
	document.original_title = document.title;

	if($('.ui-box').is('[data-auto-resize]') ){
		$(window).on('resizeEnd', function(){
			var H = window.innerHeight,
			 	W = window.innerWidth,
			 	landscape = ( H <= W ),
			 	D = landscape? {min: H, max: W} : {min: W, max: H},
			 	style = $('.ui-box').is('[data-box-style]') ? $('.ui-box').data('box-style') : 'contain',
				refD = style == 'cover' ? D.max : D.min,

			 	boxSize = $('.ui-box').is('[data-box-size]') ? $('.ui-box').data('box-size') : '60%';
				pxBoxSize = boxSize[boxSize.length -1] == "%" ? (refD*parseInt(boxSize.substr(0,boxSize.length-1),10)/100) : boxSize,
				padSize = style == 'cover' ? (pxBoxSize - D.min) /2 : 'auto' ;
				padding = landscape? padSize+'px auto' : 'auto '+padSize+'px';
				console.log( landscape, padding );


			$('.ui-box').css({
				width:  pxBoxSize,
				height: pxBoxSize,
				padding: padding
			});

		});
	}
// evenements :
	$('input').on("change", function(){
	  	var srcId = $(this).attr('id'),
	  		hash = '#'+srcId;
		
		$('.ui-box > .ui-body > label[for="'+srcId+'"]').addClass('active').siblings('label').removeClass('active');
		
		if( window.location.hash !== hash){
			var $label = $('[for='+srcId+']');
			document.title = document.original_title + ( $label.is('[title]')? ' > '+ $label.attr('title') : '' );
			history.pushState( {}, document.title, hash );
		}
	});


history.onpushstate = function(event){
	console.log('pushstate');
};
	window.onpopstate = function(event) {
		console.log('popstate');
		if(window.location.hash || window.location.hash.length > 1 ){
			var $label = $('[for='+window.location.hash+']');
			document.title = document.original_title + ( $label.is('[title]')? ' > '+ $label.attr('title') : '' );
			$( 'input'+window.location.hash ).attr('checked', true);
		}
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


	$(document).on('touchstart', function(e){
		console.log('touchstart');
	});
	$(document).on('touchmove', function(e){
		console.log('touchmove');
	});
	$(document).on('touchend', function(e){
		console.log('touchend');
	});

// le tricks du clavier
	//$(document).on('touchstart', function(e){


		// // declaration
	//  	var code = e.rkeyCode ? e.keyCode : e.which,
		// 	target = false;

		// //console.log(code);
	//  	// selon la touche qui est appuyé, on fait quekchose :
	//    switch(code){
		// 	case 37:	target = 'left';		break;
		// 	case 38:	target = 'top';			break;
		// 	case 39:	target = 'right';		break;
		// 	case 40:	target = 'bottom';		break;

		// 	case 33:	target = 'previous';	break;// pageUp
		// 	case 34:	target = 'next';		break;// pageDown

		// 	case 36:	target = 'first';		break;// debut
		// 	case 35:	target = 'last';		break;// end
		// }

		// // si on fait quekchose, on annule le comportement par défault:
		// if(target){

		// 	$('input:checked').changeTo(target);
		// 	e.preventDefault();
		// 	e.stopPropagation();
		// 	return false;
		// }

	//});






	// Go on the right Layout at loading.
	$(window).trigger('resizeEnd');
	if(window.location.hash) $(window).trigger('onpopstate');


});
