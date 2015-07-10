S = {};
Pandora = {
	init: function(context,callback) {
		var ctx = (typeof context === 'string') ? context + ' ' : '';
		// Store
		S.$window = $(window);
		S.$body = $('body');

		// Init
		for (var a in Pandora) {
			if (typeof Pandora[a].init === 'function') {
				Pandora[a].init(ctx);
			}
		}
		if(typeof callback === 'function'){
			callback();
		}
	}
};