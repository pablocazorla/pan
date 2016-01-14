// Basic
S = {};
Pandora = {
	init: function(context, callback) {
		var ctx = (typeof context === 'string') ? context + ' ' : '';
		// Store
		S.$window = Pandora.$window = $(window);
		S.$body = $('body');

		// Utils
		Pandora.cssTransition = (function() {
			var dummyStyles = document.createElement('div').style,
				prefixes = 'WebkitT MozT OT MsT webkitT mozT oT msT t'.split(' '),
				l = prefixes.length,
				t;

			for (var i = 0; i < l; i++) {
				if (dummyStyles[prefixes[i] + 'ransition'] !== undefined) {
					t = prefixes[i] + 'ransition';
				}
			}

			return function($elements, p) {
				var prop = p || '';
				$elements.each(function() {
					this.style[t] = prop;
				});
			};
		})();


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