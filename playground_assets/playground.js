$('document').ready(function() {

	'use strict';

	// classWord
	var classWord = 'playground';

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

	var $playgroundList = $('#playground-list'),
		createLink = function(nome) {
			var $link = $('<div class="playground-list-element"></div>'),
				$chk = $('<span class="playground-list-switch"></span>'),
				$a = $('<a href="#' + nome + '-' + classWord + '">' + nome + '</a>');
			$link.append($chk).append($a).appendTo($playgroundList);
			$chk.click(function() {
				if (mapSwitchElements[nome]) {
					$link.addClass('off');
					$('#' + nome + '-' + classWord).addClass('off');
					mapSwitchElements[nome] = false;
				} else {
					$link.removeClass('off');
					$('#' + nome + '-' + classWord).removeClass('off');
					mapSwitchElements[nome] = true;
				}
			});
		};

	var loadElement = function(format, nome, callback) {
			var u = format + '/' + nome + '.' + format;
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
		indJs = 0,
		loadJs = function() {
			var u = 'js/' + mapJs[indJs] + '.js';
			$.getScript(u, function() {
				++indJs;
				if (indJs < mapJs.length) {
					loadJs();
				} else {
					Pandora.init();
				}
			});
		};

	/////////////////////////////////
	loadHtml();
});