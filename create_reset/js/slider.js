Pandora.sliderConstructor = (function() {
	"use strict";
	var defined = false;



	var s = function(options) {
		return this.init_(options);
	};

	s.prototype = {
		init_: function(options) {
			var setup = $.extend({
				selection: null,
				duration: 600,
				height: 'auto',
				drag: true,

				type: 'slide', // fade

				arrows: true,
				arrows_outside: false,
				pages: false,
				pages_outside: false,

				// buttons
				arrowleft: '<i class="fa fa-angle-left"></i>',
				arrowright: '<i class="fa fa-angle-right"></i>',
				page: '<i class="fa fa-circle-thin"></i>',
				pagecurrent: '<i class="fa fa-circle"></i>',

				autoplay: false,
				autoplayduration: 6000,
				autoplaystopevent: null,

				// Callback
				afterChange: function() {}

			}, options);
			this.$wrap = $(setup.selection).eq(0);
			this.config = $.extend(setup, this.$wrap.data());
			this.current = 0;

			var self = this;

			this.moving = false;

			this.textTransition = ((this.config.type === 'fade') ? 'opacity ' : 'left ') + this.config.duration + 'ms';



			// Collection
			this.$collection = this.$wrap.find('> .slider-framer > .frame').each(function(index) {
				if ($(this).hasClass('current')) {
					self.current = index;
				}
			});
			this.last = this.$collection.length - 1;

			if (this.config.height !== 'auto') {
				this.$collection.css('height', this.config.height);
			}


			// Contents
			this.$content = this.$wrap.find('.slider-content');

			// Arrows			
			if (this.config.arrows) {
				var positionArrows = (this.config.arrows_outside) ? ' outside' : '';
				$('<div class="slide-arrow to-left' + positionArrows + '"><span>' + this.config.arrowleft + '</span></div>')
					.appendTo(this.$wrap)
					.click(function() {
						self.change(self.current - 1);
					});
				$('<div class="slide-arrow to-right' + positionArrows + '"><span>' + this.config.arrowright + '</span></div>')
					.appendTo(this.$wrap)
					.click(function() {
						self.change(self.current + 1);
					});
			}

			// Pages
			if (this.config.pages) {
				var positionPages = (this.config.pages_outside) ? ' outside' : '';

				this.$pager = $('<div class="slide-pages' + positionPages + '"/>')
					.appendTo(this.$wrap);

				var addPage = function(index) {
					var classCurrent = (self.current === index) ? 'current' : '';
					$('<span class="' + classCurrent + '">' + self.config.page + self.config.pagecurrent + '</span>')
						.appendTo(self.$pager)
						.click(function() {
							self.change(index);
						});
				};
				this.$collection.each(addPage);
			}

			if (this.config.drag) {
				this.setMobileTouch(this);
				this.$wrap.find('img').each(function() {
					this.ondragstart = function() {
						return false;
					};
				});
			}
			// Wait visible
			var wait = setInterval(function() {
				if (self.$wrap.is(':visible')) {
					// visible, do something
					self.resetPositions(self).setContentPosition().setEvents(self);
					clearInterval(wait);
					if (self.config.autoplay) {
						var playerTime = setInterval(function() {
							self.change(self.current + 1);
						}, self.config.autoplayduration);
						if (typeof self.config.autoplaystopevent === 'string') {
							self.$wrap.bind(self.config.autoplaystopevent, function() {
								clearInterval(playerTime);
							});
						}
					}
				}
			}, 50);

			// Fade option
			if (this.config.type === 'fade') {
				this.$collection.addClass('fade');
				this.$collection.css('left', '0').eq(this.current).css({
					'z-index': '11',
					'opacity': '1'
				});
			}

			return this;
		},
		setMobileTouch: function(self) {
			if (typeof Hammer !== 'undefined') {

				var $sliderFramer = this.$wrap.find('>.slider-framer');
				var hammertime = new Hammer($sliderFramer[0]);

				hammertime.get('pan').set({
					direction: Hammer.DIRECTION_ALL
				});

				var delta = 0;
				hammertime.on('pan', function(ev) {
					if (!self.moving) {
						delta = 100 * ev.deltaX / $sliderFramer.width();
						self.setPanPosition(delta);
					}
				});
				hammertime.on('panend', function() {
					if (delta >= 30) {
						self.change(self.current - 1);
					}
					if (delta <= -30) {
						self.change(self.current + 1);
					}
					if (delta > -30 && delta < 30) {
						self.restoreDragPosition(self);
					}
					delta = 0;
				});
			}
			return this;
		},
		restoreDragPosition: function(self) {
			if (this.config.type != 'fade') {
				this.moving = true;
				Pandora.cssTransition(this.$collection, this.textTransition);

				var prev = this.current - 1,
					next = this.current + 1;

				prev = (prev < 0) ? this.last : prev;
				next = (next > this.last) ? 0 : next;

				this.$collection.eq(prev).css('left', '-100%');
				this.$collection.eq(this.current).css('left', '0%');
				this.$collection.eq(next).css('left', '100%');

				setTimeout(function() {
					Pandora.cssTransition(self.$collection, '');
					setTimeout(function() {
						self.moving = false;
					}, 50);
				}, this.config.duration + 50);
			}
			return this;
		},
		setPanPosition: function(delta) {
			if (this.config.type != 'fade') {
				var prev = this.current - 1,
					next = this.current + 1;

				prev = (prev < 0) ? this.last : prev;
				next = (next > this.last) ? 0 : next;

				this.$collection.eq(prev).css('left', -100 + delta + '%');
				this.$collection.eq(this.current).css('left', delta + '%');
				this.$collection.eq(next).css('left', 100 + delta + '%');
			}
			return this;
		},
		resetPositions: function(self) {
			if (this.config.type != 'fade') {
				this.$collection.each(function(index) {
					var pos = 0;
					if (index < self.current) {
						pos = -100;
					}
					if (index > self.current) {
						pos = 100;
					}
					if ((index - 1) > self.current) {
						pos = 200;
					}
					$(this).css('left', pos + '%');
				});
				if (this.current === 0) {
					this.$collection.eq(this.last).css('left', '-100%');
				}
				if (this.current === this.last) {
					this.$collection.eq(0).css('left', '100%');
				}
			}
			return this;
		},
		setContentPosition: function() {
			this.$content.each(function() {
				var $this = $(this),
					h = -.5 * $this.height();
				$this.css('margin-top', h + 'px');
			});
			return this;
		},
		updatePager: function() {
			if (this.config.pages) {
				this.$pager.find('span').removeClass('current').eq(this.current).addClass('current');
			}
			return this;
		},
		change: function(num) {
			var dir = (num >= this.current) ? -1 : 1,
				next = num;
			if (num < 0) {
				next = this.last;
				dir = 1;
			}
			if (num > this.last) {
				next = 0;
				dir = -1;
			}
			if (!this.moving && next !== this.current) {
				Pandora.cssTransition(this.$collection, this.textTransition);
				var self = this;
				this.moving = true;
				switch (this.config.type) {
					case 'fade':
						this.$collection.eq(next).css({
							'z-index': '12',
							'opacity': '1'
						});

						setTimeout(function() {
							Pandora.cssTransition(self.$collection, '');

							self.$collection.eq(self.current).css({
								'z-index': '10',
								'opacity': '0'
							});
							self.$collection.eq(next).css({
								'z-index': '11'
							});
							console.log(self.current + ' - ' + next);
							self.current = next;
							setTimeout(function() {
								self.updatePager();
								self.moving = false;
							}, 50);
						}, this.config.duration + 50);

						break;
					default:

						this.$collection.eq(next).addClass('current').css('left', '0%');
						this.$collection.eq(this.current).removeClass('current').css('left', dir * 100 + '%');
						setTimeout(function() {
							Pandora.cssTransition(self.$collection, '');
							self.current = next;
							setTimeout(function() {
								self.resetPositions(self).updatePager();
								self.moving = false;
							}, 50);
						}, this.config.duration + 50);
				}
				this.setContentPosition();


			}
			return this;
		},
		setEvents: function(self) {
			Pandora.$window.resize(function() {
				self.setContentPosition();
			});
			return this;
		}
	};

	return {
		init: function(ctx) {
			if (!defined) {
				Pandora.slider = function(options) {
					return new s(options);
				}
				defined = true;
			}
			$(ctx + '.slider.auto').each(function() {
				Pandora.slider({
					selection: this
				});
			});
		}
	};
})();