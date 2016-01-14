Pandora.headerConstructor = (function() {
	"use strict";
	var defined = false;

	var hed = function(options) {
		return this.init_(options);
	};

	hed.prototype = {
		init_: function(options) {
			var setup = $.extend({
				selection: null,
				classfixed: '',
				fixposition: 200,
				parentscroll: window
			}, options);

			this.$wrap = $(setup.selection).eq(0);
			this.config = $.extend(setup, this.$wrap.data());

			this.$scroller = $(this.config.parentscroll);

			this.origClasses = this.$wrap.attr('class');

			this.fixed = false;

			this.$dummyFloat = false;

			if (!this.$wrap.hasClass('float')) {
				this.$dummyFloat = $('<div/>')
					.css({
						'width': '80px',
						'height': this.$wrap.outerHeight(),
						'padding': '0',
						'border': 'none'
					})
					.insertBefore(this.$wrap)
					.hide();
			}

			return this.setClasses(this.$scroller.scrollTop()).setEvents(this);
		},
		setClasses: function(scroll) {

			if (scroll >= this.config.fixposition && !this.fixed) {
				// Fixed
				this.$wrap.attr('class', 'main-header ' + this.config.classfixed + ' fixed-header');
				if (this.$dummyFloat) {
					this.$dummyFloat.show();
				}
				this.fixed = true;
			}
			if (scroll < this.config.fixposition && this.fixed) {
				// UnFixed
				this.$wrap.attr('class', this.origClasses);
				if (this.$dummyFloat) {
					this.$dummyFloat.hide();
				}
				this.fixed = false;
			}

			return this;
		},
		setEvents: function(self) {

			this.$scroller.scroll(function() {
				self.setClasses(self.$scroller.scrollTop());
			});
			return this;
		}
	};

	return {
		init: function(ctx) {
			if (!defined) {
				Pandora.header = function(options) {
					return new hed(options);
				}
				defined = true;
			}
			$(ctx + '.main-header.auto').each(function() {
				console.log('va');
				Pandora.header({
					selection: this
				});
			});
		}
	};
})();