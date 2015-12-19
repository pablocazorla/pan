(function($, map) {
	"use strict";

	$('document').ready(function() {

		var $playgroundIndex = $('#playground-index'),
			$list = $('#playground-list');
		$('#playground-index-toggle').click(function() {
			$playgroundIndex.toggleClass('open');
		});

		// Render list
		var renderList = function(o) {
			if (o.name != 'hidden') {
				var $tit = $('<div class="playground-list-tit">'+o.name+'</div>').appendTo($list);
			}
		};
		for (var a in map) {
			renderList(map[a]);
		};



	});
})(jQuery, mapResources);