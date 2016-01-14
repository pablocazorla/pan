Pandora.parallaxConstructor = (function() {
	"use strict";
	var defined = false;

	var p = function(options) {
		return this.init_(options);
	};

	p.prototype = {
		init_: function(options) {
			var setup = $.extend({
				selection: null,
				backgroundposition: 'top center',
				cover: 'full', // 'pattern' 
				dimmercolor: '#000',
				dimmeropacity: .3,
				dimmerfade: .6,
				height: 500,
				velocity: .3,
				parentscroll: window
			}, options);

			this.$wrap = $(setup.selection).eq(0);

			this.config = $.extend(setup, this.$wrap.data());

			if (this.$wrap.css('position') === 'static') {
				this.$wrap.css('position', 'relative');
			}

			this.$content = this.$wrap.find('.parallax-content');

			this.$screen = this.$wrap.find('.parallax-background').css({
					'background-color': this.config.dimmercolor
				});
			this.$imgContainer = this.$screen.find('.parallax-background-content').css({
					opacity: (1 - this.config.dimmeropacity)
				});




			var self = this;
			// Wait visible
			var wait = setInterval(function() {
				if (self.$wrap.is(':visible')) {
					// visible, do something
					self.setSize().setImgPosition();
					self.$wrap.css('opacity','1');
					clearInterval(wait);
				}
			}, 50);

				


			return this.setSize().setImgPosition().setEvents(self);
		},
		setSize: function() {
			// Set height of screen
			var h = (this.config.height === 'full') ? Pandora.$window.height() : this.config.height;
			this.$wrap.height(h);

			// Center the content
			var hCont = this.$content.height();
			this.$content.css({
				marginTop: -.5 * hCont + 'px'
			});
			return this.setImgPosition();
		},
		setImgPosition: function() {
			var self = this;

			var top = self.$wrap.offset().top;

			if (self.config.dimmerfade > 0) {
				var h = -1 * top / self.$wrap.height();
				h = (h < 0) ? 0 : ((h > 1) ? 1 : h);
				self.$imgContainer.css({
					top: -1 * top * self.config.velocity + 'px',
					opacity: 1 - (h * (self.config.dimmerfade - self.config.dimmeropacity) + self.config.dimmeropacity)
				});
			} else {
				self.$imgContainer.css({
					top: -1 * top * self.config.velocity + 'px'
				});
			}
			return this;
		},
		setEvents: function(self) {
			Pandora.$window.resize(function() {
				self.setSize();
			});
			setInterval(function() {
				self.setSize();
			}, 500);

			$(self.config.parentscroll).scroll(function() {
				self.setImgPosition();
			});


			return this;
		}
	};

	return {
		init: function(ctx) {
			if (!defined) {
				Pandora.parallax = function(options) {
					return new p(options);
				}
				defined = true;
			}
			$(ctx + '.parallax.auto').each(function() {
				Pandora.parallax({
					selection: this
				});
			});
		}
	};
})();