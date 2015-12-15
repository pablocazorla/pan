Pandora.collapser = {
	init: function(ctx) {
		$(ctx + '.collapser').each(function() {
			var $this = $(this);
			
			$this.find('> .collapser-trigger').click(function(e){
					e.preventDefault();
					$this.toggleClass('show');
				});
		});
	}
};