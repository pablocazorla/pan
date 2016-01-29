// Basic
S = {};
Pandora = {
	init: function(context, callback) {
		var ctx = (typeof context === 'string') ? context + ' ' : '';
		// Store
		S.$window = Pandora.$window = $(window);
		S.$body = $('body');

		// Utils
		var getPrefix = (function() {
			var dummyStyles = document.createElement('div').style,
				cache = {};
			return function(str) {
				if (cache[str] !== undefined) {
					return cache[str];
				} else {
					var STR = str.substring(0, 1).toUpperCase() + str.substring(1),
						prefixes = 'Webkit Moz O Ms webkit moz o ms'.split(' '),
						l = prefixes.length,
						t;

					for (var i = 0; i < l; i++) {
						if (dummyStyles[prefixes[i] + STR] !== undefined) {
							t = prefixes[i] + STR;
						}
					}
					if (dummyStyles[str] !== undefined) {
						t = str;
					}
					cache[str] = t;
					return t;
				}
			}
		})();
		var css3 = function(prop, $elements, p) {
			var t = getPrefix(prop),
				prop = p || '';
			$elements.each(function() {
				this.style[t] = prop;
			});
		};

		Pandora.cssTransition = function($elements, p) {
			css3('transition',$elements, p);
			return Pandora;
		};
		Pandora.cssTransform = function($elements, p) {
			css3('transform',$elements, p);
			return Pandora;
		};

		// Init
		for (var a in Pandora) {
			if (typeof Pandora[a].init === 'function') {
				Pandora[a].init(ctx);
			}
		}
		if (typeof callback === 'function') {
			callback();
		}
	}
};