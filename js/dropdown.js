Pandora.dropdown = {
	init: function(ctx) {		
		// for selects
		$(ctx + 'select.dropdown').each(function() {
			var $select = $(this).removeClass('dropdown').hide(),
				$options = $select.find('option'),

				triangleHtml = ' <span class="triangle"></span>',

				$dropdown = $('<span class="dropdown extended"></span>'),
				$toggle = $('<a class="btn btn-primary dropdown-toggle" href="javascript:void(0);"></a>').html($options.filter(':selected').text() + triangleHtml).appendTo($dropdown),

				$menu = $('<span class="dropdown-menu"></span>').appendTo($dropdown),
				arrayLinks = [];

			for (var i = 0; i < $options.length; i++) {
				$('<span><a href="#sadas">' + $options.eq(i).text() + '</a></span>').appendTo($menu);
			};
			$select.after($dropdown);

			$menu.find('a').each(function(index) {
				var $a = $(this),
					$o = $options.eq(index);
				$a.click(function(e) {
					e.preventDefault();
					$o.prop('selected', true);
					$toggle.html($a.text() + triangleHtml).blur();
				});
			});
		});
		//dropdowns
		$(ctx + '.dropdown').not('.disabled').each(function() {
			var $this = $(this),
				$toggle = $this.find('> .dropdown-toggle'),
				$menu = $this.find('> .dropdown-menu'),
				active = false,
				clickInside = false,
				fading = false,
				duration = 100;



			$toggle.click(function() {
				if (!active && !fading) {
					$menu.fadeIn(duration, function() {
						active = true;
						fading = false;
						clickInside = false;
					});
				}
				clickInside = true;
			})
			.click(function(e) {
				e.preventDefault();
			});
			$this.find('.disabled').click(function(e) {
				e.preventDefault();				
			}).mousedown(function() {
				clickInside = true;
			});


			S.$window.mousedown(function() {
				if (active && !clickInside && !fading) {
					fading = true;
					$menu.fadeOut(duration, function() {
						active = false;
						fading = false;
					});
				}
				clickInside = false;
			});

		});
	}
};