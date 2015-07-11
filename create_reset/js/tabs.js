Pandora.tabs = {
	init: function(ctx) {
		$(ctx + '.tabs').each(function() {
			var $list = $(this).find('.tab-list > li'),
				$content = $(this).find('.tab-content > li');

			$list.eq(0).addClass('active');
			$content.eq(0).addClass('active');

			$list.each(function(index) {
				var $this = $(this);
				$this.click(function() {
					if (!$this.hasClass('active')) {
						$list.removeClass('active');
						$this.addClass('active');
						$content.removeClass('active').eq(index).addClass('active');
					}
				});
			});
		});
	}
};