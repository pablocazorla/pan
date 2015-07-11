Pandora.modalConstructor = {
	initializated: false,
	init: function() {

		"use strict";

		if (!this.initializated) {
			this.initializated = true;
			var $dimmer,
				idCounter = 0,
				current = null,
				shown = false,
				changing = false,
				paddingVertical = 0,

				scrollbarWidth = (function() {
					var outer = document.createElement("div");
					outer.style.visibility = "hidden";
					outer.style.width = "100px";
					outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
					document.body.appendChild(outer);
					var widthNoScroll = outer.offsetWidth;
					// force scrollbars
					outer.style.overflow = "scroll";
					// add innerdiv
					var inner = document.createElement("div");
					inner.style.width = "100%";
					outer.appendChild(inner);
					var widthWithScroll = inner.offsetWidth;

					// remove divs
					outer.parentNode.removeChild(outer);
					return widthNoScroll - widthWithScroll;
				})();

			var m = function(options) {
				return this.create(options);
			};
			m.prototype = {
				create: function(options) {
					this.id = idCounter++;

					this.config = $.extend({
						maxWidth: 'auto',
						duration: 300,
						onShow: function() {},
						afterShow: function() {},
						onHide: function() {},
						afterHide: function() {},
						content: '',
						hideClickDimmer: true,
						showCloseButton: true,
						actions: []
					}, options);

					var self = this;
					// Render
					if (typeof $dimmer === 'undefined') {
						$dimmer = $('<div class="dimmer"></div>').appendTo(S.$body).click(function() {
							if (current !== null && current.config.hideClickDimmer) {
								current.hide();
							}
						});
					}
					this.$modal = $('<div class="modal"></div>').appendTo(S.$body);
					this.$modalBody = $('<div class="modal-body"></div>').appendTo(this.$modal);

					if (this.config.showCloseButton) {
						var $modalClose = $('<span class="modal-close" aria-hidden="true">×</span>').appendTo(this.$modalBody).click(function() {
							self.hide();
						});
					}
					this.$modalScroll = $('<div class="modal-scroll"></div>').appendTo(this.$modalBody);
					this.$modalContent = $('<div class="clearfix modal-content"></div>').appendTo(this.$modalScroll);
					this.$modalActions = $('<div class="modal-actions"></div>').appendTo(this.$modalScroll);

					paddingVertical = Math.round(parseInt(this.$modalBody.css('padding-top')) + parseInt(this.$modalBody.css('padding-bottom')));

					this.timerToResize = null;

					S.$window.resize(function() {
						self.resize(700);
					});

					return this.content(this.config.content).renderActions().resize();
				},
				content: function(c) {
					this.config.content = c;
					if (typeof c === 'string') {
						this.$modalContent.html(c);
					} else {
						this.$modalContent.html('').append($(c));
					}
					return this.resize(100);
				},
				actions: function(arr) {
					this.config.actions = arr;
					return this.renderActions();
				},
				renderActions: function() {
					var self = this;
					this.$modalActions.html('');
					for (var i = 0; i < this.config.actions.length; i++) {
						var acc = $.extend({
							tag: 'a',
							className: '',
							text: 'Button',
							click: null
						}, this.config.actions[i]);
						if (typeof acc.click !== 'function' && acc.tag === 'a') {
							acc.tag = 'span';
						}
						var href = (acc.tag === 'a') ? ' href=""' : '';
						var cl = (acc.className !== '') ? ' class="' + acc.className + '"' : '';

						var $acc = $('<' + acc.tag + href + cl + '>' + acc.text + '</' + acc.tag + '>').appendTo(this.$modalActions);
						$('<span>&nbsp;</span>').appendTo(this.$modalActions);

						if (typeof acc.click === 'function') {
							$acc.click(function(e) {
								e.preventDefault();
								acc.click.apply(null, [self]);
							});
						}
					}
					return this;
				},
				show: function(callback) {
					var cbk = callback || function() {};
					if (!shown && !changing) {
						var self = this;
						this.config.onShow.apply(null, [self]);
						if (S.$body.height() > S.$window.height()) {
							S.$body.css({
								'overflow': 'hidden',
								'padding-right': scrollbarWidth + 'px'
							});
						}
						current = this;
						changing = true;
						$dimmer.fadeIn(this.config.duration);
						this.$modal.fadeIn(this.config.duration, function() {
							shown = true;
							changing = false;
							cbk.apply(null, [self]);
							self.config.afterShow.apply(null, [self]);
						});
					}
					return this.resize(10);
				},
				hide: function(callback) {
					var cbk = callback || function() {};
					if (shown && !changing) {
						var self = this;
						this.config.onHide.apply(null, [self]);
						current = null;
						changing = true;
						$dimmer.fadeOut(this.config.duration);
						this.$modal.fadeOut(this.config.duration, function() {
							shown = false;
							changing = false;
							S.$body.css({
								'overflow': 'auto',
								'padding-right': '0'
							});
							cbk.apply(null, [self]);
							self.config.afterHide.apply(null, [self]);
						});
					}
					return this;
				},
				onShow: function(f) {
					this.config.onShow = f;
					return this;
				},
				afterShow: function(f) {
					this.config.afterShow = f;
					return this;
				},
				onHide: function(f) {
					this.config.onHide = f;
					return this;
				},
				afterHide: function(f) {
					this.config.afterHide = f;
					return this;
				},
				resize: function(delay) {
					var self = this;
					if (this.timerToResize !== null) {
						clearTimeout(this.timerToResize);
						this.timerToResize = null;
					}
					this.timerToResize = setTimeout(function() {
						self.$modalScroll.css({
							height: 'auto'
						});
						var modH = Math.round(self.$modal.height()),
							winH = Math.round(S.$window.height()),
							newModH = (modH <= winH) ? 'auto' : (winH - 20 - paddingVertical) + 'px',
							top = Math.round(.5 * (winH - modH)) - 10;

						top = (top < 0) ? 0 : top;

						self.$modal.css({
							top: top + 'px'
						});
						self.$modalScroll.css({
							height: newModH
						});
						clearTimeout(this.timerToResize);
						this.timerToResize = null;
					}, delay);

					return this;
				}
			};

			Pandora.modal = function(options) {
				return new m(options);
			}
		}
	}
};