Pandora.parallaxConstructor = (function() {
	"use strict";
	var defined = false;

	var p = function(options) {
		return this.init_(options);
	};

	p.prototype = {
		init_: function(options) {
			this.config = $.extend({
				id: null,
				backgroundImage: '',
				backgroundPosition: 'top center',
				cover: 'full', // 'pattern' 
				dimmerColor: '#000',
				dimmerOpacity: .3,
				dimmerFade: .6,
				height: 500,
				width: '100%',
				velocity: .3
			}, options);

			this.$wrap = $('#' + this.config.id);

			if (this.$wrap.css('position') === 'static') {
				this.$wrap.css('position', 'relative');
			}

			this.$content = this.$wrap.find('.parallax-content');

			this.$screen = $('<div class="parallax-screen"/>')
				.prependTo(this.$wrap).css({
					'background-color': this.config.dimmerColor
				});

			this.$imgContainer = $('<div class="parallax-img-container"/>')
				.appendTo(this.$screen)
				.css({
					opacity: (1 - this.config.dimmerOpacity)
				});
			this.$img = $('<img/>')
				.appendTo(this.$imgContainer);

			var self = this;

			this.$img.load(function() {
				self.imgWidth = $(this).width();
				self.imgHeight = $(this).height();
				self.imgMod = self.imgWidth / self.imgHeight;
				self.setImgPosition();
			});

			this.$img.attr('src', this.config.backgroundImage);


			return this.setSize().setEvents(self);
		},
		setSize: function() {
			var h = (this.config.height === 'full') ? Pandora.$window.height() : this.config.height;
			this.$wrap.css({
				height: h,
				width: this.config.width
			});

			var hCont = this.$content.height();
			this.$content.css({
				marginTop: -.5 * hCont + 'px'
			});
			return this;
		},
		setImgPosition: function() {
			var self = this;
			setInterval(function() {


				var top = self.$wrap.offset().top;

				if (self.config.dimmerFade > 0) {
					var h = -1 * top / self.$wrap.height();
					h = (h < 0) ? 0 : ((h > 1) ? 1 : h);
					self.$imgContainer.css({
						top: -1 * top * self.config.velocity + 'px',
						opacity: 1 - (h * (self.config.dimmerFade - self.config.dimmerOpacity) + self.config.dimmerOpacity)
					});
				} else {
					self.$imgContainer.css({
						top: -1 * top * self.config.velocity + 'px'
					});
				}
			}, 20);
			return this;
		},
		setEvents: function(self) {
			Pandora.$window.resize(function() {
				self.setSize();
			});
			setInterval(function() {
				self.setSize();
			}, 500);
			return this;
		}
	};

	return {
		init: function() {
			if (!defined) {
				Pandora.parallax = function(options) {
					return new p(options);
				}
				defined = true;
			}
		}
	};
})();