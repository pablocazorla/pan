Pandora.tooltip = {
	init: function(ctx) {
		$(ctx + '.tooltip').each(function() {
			var $this = $(this),
				title = (function() {
					var t = $this.attr('title');
					$this.attr('title', '');
					return t;
				})(),
				$title = $('<span class="tooltip-title">'+title+'<span class="tooltip-triang"></span></span>').appendTo($this),
				setPosition = function(){

				};
			setPosition();
			$this.hover(setPosition);
		});
	}
};

