Pandora.anim = {
	init: function(ctx) {

		var collection = {},
			idCounter = 0,
			scroller = window;

		$(ctx + '.anim').each(function() {
			var $this = $(this);
			var config = $.extend({
				'from': 'bottom',
				'start': false,
				'end': false,
				'duration': 400,
				'timing': 'ease-out',
				'hidden': true
			}, $this.data());
			if (config.parentscroll) {
				scroller = config.parentscroll;
			}
			var opacityTransition = '';
			if (config.hidden) {
				$this.css('opacity', '0');
				opacityTransition = ', opacity ' + config.duration + 'ms ' + config.timing;
			}
			switch (config.from) {
				case 'bottom':
					var h = $this.outerHeight();
					config.start = (!config.start) ? 'translateY(' + h + 'px)' : config.start;
					config.end = (!config.end) ? 'translateY(0px)' : config.end;



					break;
				default:
					//
			}

			Pandora
				.cssTransform($this, config.start)
				.cssTransition($this, 'transform ' + config.duration + 'ms ' + config.timing + opacityTransition);
			collection['item-' + idCounter] = {
					$elem: $this,
					id: 'item-' + idCounter,
					config: config,
					ready: false
				}
				++idCounter;
		});

		var test = function() {
			var readyList = [];
			for (var a in collection) {
				var o = collection[a],
					d = o.$elem.offset().top - Pandora.$window.height();
				if (d < 0 && !o.ready) {
					o.ready = true;
					readyList.push(o);
				}
			}
			var l = readyList.length,
				dif = Math.round(1000 / l),
				t = 50,
				show = function(o, ti) {
					setTimeout(function() {

						Pandora
							.cssTransform(o.$elem, o.config.end);
						if (o.config.hidden) {
							o.$elem.css('opacity', '1');
						}
						var ide = o.id;
						delete collection[ide];
					}, ti);
				};

			for (var i = 0; i < l; i++) {
				show(readyList[i], t);
				t += dif;
			}
		};

		$(scroller).scroll(test);
		Pandora.$window.resize(test);


	}
};