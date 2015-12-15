Pandora.alert = {
	init: function(ctx) {
		$(ctx + '.alert').each(function() {
			var $this = $(this);
			if ($this.hasClass('with-closer')) {
				var $closer = $('<span aria-hidden="true" class="alert-closer">×</span>');

				$this.prepend($closer);
				$closer.click(function(){
					$this.fadeOut(400);
				});
			}
		});
	}
};