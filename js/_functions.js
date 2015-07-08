S = {};
Pandora = {
	init: function(context) {
		var ctx = (typeof context === 'string') ? context + ' ' : '';
		// Store
		S.$window = $(window);

		// Init
		for (var a in Pandora) {
			if (typeof Pandora[a].init === 'function') {
				Pandora[a].init(ctx);
			}
		}
	}
};