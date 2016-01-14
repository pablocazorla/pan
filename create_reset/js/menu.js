Pandora.menues = (function() {
	"use strict";
	return {
		init: function(ctx) {
			$(ctx + '.menu').each(function() {
				var $this = $(this);
				$this.find('li ul').prev().append('<i class="fa fa-caret-down"></i>');

				var $menuOpener = $('<div aria-hidden="true" class="menu-opener"><i class="fa fa-bars"></i></div>')
					.insertBefore($this)
					.click(function(){
						$this.addClass('open');
					});

				$('<span aria-hidden="true" class="menu-close">×</span>')
					.appendTo($this)
					.click(function(){
						$this.removeClass('open');
					});

				if($this.hasClass('menu-responsive')){
					$menuOpener.css('display','block');
				}
				if($this.hasClass('to-right')){
					$menuOpener.addClass('to-right');
				}
				if($this.hasClass('to-left')){
					$menuOpener.addClass('to-left');
				}
				if($this.hasClass('to-center')){
					$menuOpener.addClass('to-center');
				}

			});
		}
	}
})();