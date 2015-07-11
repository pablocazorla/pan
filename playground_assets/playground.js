$('document').ready(function() {

	'use strict';

	// classWord
	var classWord = 'playground',
		route = 'create/';

	// Parse Map
	var mapHtml = [],
		mapLess = [],
		mapJs = [],
		mapSwitchElements = {};

	for (var i = 0; i < mapResources.length; ++i) {
		var a = mapResources[i].split('('),
			n = a[0],
			t = a[1];

		mapSwitchElements[n] = true;

		if (t.indexOf('html') !== -1) {
			mapHtml.push(n);
		}
		if (t.indexOf('less') !== -1) {
			mapLess.push(n);
		}
		if (t.indexOf('js') !== -1) {
			mapJs.push(n);
		}
	};

	var compiledResult = {
		css: '',
		js: ''
	};

	var switchElement = function(nome) {
		if (mapSwitchElements[nome]) {
			$('#' + nome + '-' + classWord + '-link').addClass('off');
			$('#' + nome + '-' + classWord).addClass('off');
			mapSwitchElements[nome] = false;
		} else {
			$('#' + nome + '-' + classWord + '-link').removeClass('off');
			$('#' + nome + '-' + classWord).removeClass('off');
			mapSwitchElements[nome] = true;
		}
		renderLessStyles();
	};

	var $playgroundList = $('#playground-list'),
		createLink = function(nome) {
			var $link = $('<div class="playground-list-element" id="' + nome + '-' + classWord + '-link"></div>'),
				$chk = $('<span class="playground-list-switch"></span>'),
				$a = $('<a href="#' + nome + '-' + classWord + '">' + nome + '</a>'),
				$reload = $('<span class="playground-list-reload" title="reload"></span>');

			$link.append($chk).append($a).append($reload).appendTo($playgroundList);
			$chk.click(function() {
				switchElement(nome);
			});
			$reload
				.click(function() {
					reloadElement(nome);
				});
		};

	var loadElement = function(format, nome, callback) {
			var u = route + format + '/' + nome + '.' + format;
			$.ajax({
				url: u,
				cache: false,
				success: callback,
				error: callback
			});
		},
		$playgroundContainer = $('#playground-container'),
		indHtml = -1,
		loadHtml = function() {
			++indHtml;
			if (indHtml < mapHtml.length) {
				var n = mapHtml[indHtml];
				loadElement('html', n, function(data) {
					$playgroundContainer.append('<div class="playground-content" id="' + n + '-' + classWord + '"><div class="playground-content-title">' + n + '</div><br>' + data + '</div>');
					createLink(n);
					loadHtml();
				});
			} else {
				loadLess();
			}
		},
		lessData = {},
		$style = $('#playground-style-output'),
		$lessError = $('#playground-error'),
		renderLessStyles = function() {
			var lessInput = '';
			for (var i = 0; i < mapLess.length; ++i) {
				var n = mapLess[i];
				if (mapSwitchElements[n]) {
					lessInput += lessData[n]
				}
			}
			if (typeof less !== 'undefined') {
				less.render(lessInput).then(function(output) {
					compiledResult.css = output.css;
					$style.html(output.css);
				}, function(error) {
					$lessError.show().text(error.message);
				});
			}
		},
		indLess = -1,
		loadLess = function() {
			++indLess;
			if (indLess < mapLess.length) {
				var n = mapLess[indLess];
				loadElement('less', n, function(data) {
					lessData[n] = data;
					loadLess();
				});
			} else {
				renderLessStyles();
				loadJs();
			}
		},
		jsData = {},
		indJs = 0,
		jsOutput = function() {
			var o = '';
			for (var i = 0; i < mapJs.length; i++) {
				var n = mapJs[i];
				if (mapSwitchElements[n]) {
					o += jsData[n];
				}
			}
			return o;
		},
		loadJs = function() {
			var n = mapJs[indJs];
			var u = route + 'js/' + n + '.js';
			$.getScript(u, function(data) {
				jsData[n] = data.replace(/</g, "&lt;").replace(/>/g, "&gt;");
				++indJs;
				if (indJs < mapJs.length) {
					loadJs();
				} else {
					Pandora.init(undefined, afterLoadAll);
				}
			});
		};

	var reloadElement = function(nome) {
		if (mapLess.indexOf(nome) != -1) {
			loadElement('less', '__variables', function(data) {
				lessData['__variables'] = data;
				loadElement('less', '_functions', function(data) {
					lessData['_functions'] = data;
					loadElement('less', nome, function(data) {
						lessData[nome] = data;
						renderLessStyles();
						if (mapHtml.indexOf(nome) != -1) {
							loadElement('html', nome, function(data) {
								$('#' + nome + '-' + classWord).html(data);
								Pandora.init('#' + nome + '-' + classWord);
							});
						}
					});
				});
			});
		}
	};

	/////////////////////////////////
	loadHtml();

	/* Compile result ***********************************************/

	var $result = $('#playground-result'),
		$result_css = $('#playground-result-css'),
		$result_js = $('#playground-result-js'),
		compileOut = function() {
			$result_css.html(compiledResult.css);
			$result_js.html(jsOutput());
			$result.show();
		};
	$('#playground-compile-btn').click(function(e) {
		e.preventDefault();
		compileOut();
	});
	$('.playground-result-close').click(function(e) {
		e.preventDefault();
		$result.hide();
	});

	/* After Load All ***********************************************/

	var afterLoadAll = function() {

		// Modal
		if (typeof Pandora.modal === 'function') {
			var myModal = Pandora.modal({
				content: 'Hola Mundo',
				//		showCloseButton: false,
				duration: 200,
				actions: [{
					text: 'Aceptar',
					className: 'btn btn-primary',
					click: function(m) {
						m.hide();
					}
				}, {
					text: 'o'
				}, {
					text: 'Cancelar',
					click: function(m) {
						m.hide();
					}
				}]
			});
			var myModalb = Pandora.modal({
				content: 'Hello Worldddd',
				hideClickDimmer: false
			});
			myModalb.onHide(function(r) {
				console.log('ID: ' + r.id);
			});

			myModal.content($('#modal-cont-a').show());


			$('#btn-show-modal').click(function(e) {
				e.preventDefault();
				myModal.show(function(r) {
					console.log(r);
				});
			});
			$('#btn-show-modal-b').click(function(e) {
				e.preventDefault();
				myModalb.show();
			});

			// Modal ajax
			var modalAjax = Pandora.modal();

			var loadedd = false;

			modalAjax.afterShow(function(m) {
				if (!loadedd) {
					m.content('Loading...');
					$.ajax({
						url: 'html/basic.html',
						cache: false,
						success: function(data) {
							m.content(data);
							loadedd = true;
						},
						error: function() {
							m.content('ERROR');
						}
					});
				}
			}).actions([{
				text: 'Aceptar',
				className: 'btn btn-primary',
				click: function(m) {
					m.hide();
				}
			}, {
				text: 'o'
			}, {
				text: 'Cancelar',
				click: function(m) {
					m.hide();
				}
			}]);


			$('#btn-show-modal-ajax').click(function(e) {
				e.preventDefault();
				modalAjax.show();
			});
		}
	}
});