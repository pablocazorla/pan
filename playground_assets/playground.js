(function($, map) {
	"use strict";

	var u = {
		observable: function(vInitial) {
			var f = function(v, running) {
				var r = running || 'run';
				if (typeof v !== 'undefined' && v !== f.val) {
					f.val = v;
					if (r === 'run') {
						run();
					}
				}
				return f.val;
			};
			f.val = vInitial;

			var subscriptions = [],
				length = 0,
				run = function() {
					for (var i = 0; i < length; i++) {
						subscriptions[i].apply(null, [f.val]);
					}
				};

			f.subscribe = function(fn) {
				subscriptions.push(fn);
				length++;
				return f;
			};
			f.unsubscribe = function() {
				subscriptions = [];
				length = 0;
				return f;
			};
			f.update = function() {
				run();
				return f;
			};
			return f;
		}
	}

	var resources = (function() {
			var res = {};
			return {
				get: function(id) {
					return res[id];
				},
				add: function(id, str) {
					var arr1 = str.split('='),
						t = arr1[0],
						arr2 = arr1[1].split('('),
						f = arr2[0],
						e = arr2[1];
					res[id] = {
						id: id,
						enabled: u.observable(true),
						title: t,
						file: f,
						less: (e.indexOf('less') > 0),
						html: (e.indexOf('html') > 0),
						js: (e.indexOf('js') > 0)
					};
				},
				each: function(cbk) {
					for (var a in res) {
						cbk.apply(null, [res[a]]);
					}
				}
			};
		})(),
		collections = (function() {
			var col = {};
			return {
				get: function(id) {
					return col[id];
				},
				add: function(id) {
					var o = {
						id: id,
						open: u.observable(false),
						enabled: u.observable(true),
						list: [],
						addResource: function(idResource) {
							o.list.push(resources.get(idResource));
						}
					};
					col[id] = o;
				},
				each: function(cbk) {
					for (var a in col) {
						cbk.apply(null, [col[a]]);
					}
				}
			};
		})();



	$('document').ready(function() {

		var $playgroundIndex = $('#playground-index'),
			$list = $('#playground-list');
		$('#playground-index-toggle').click(function() {
			$playgroundIndex.toggleClass('open');
		});

		// Render list

		var renderList = (function() {
			var idCollection = 0,
				idResource = 0,
				setCollectionEvents = function(idCollection, $li, $tit, $inp) {
					$inp.click(function() {
						var isEnabled = !collections.get(idCollection).enabled();
						collections.get(idCollection).enabled(isEnabled);
					});

					collections.get(idCollection).enabled.subscribe(function(v) {
						if (v) {
							$tit.removeClass('disabled');
						} else {
							$tit.addClass('disabled');
						}
						var le = collections.get(idCollection).list.length;
						for (var i = 0; i < le; i++) {
							collections.get(idCollection).list[i].enabled(v);
						}
					});

					$tit.click(function() {
						collections.each(function(collection) {
							collection.open(false);
						});
						collections.get(idCollection).open(true);
					});

					collections.get(idCollection).open.subscribe(function(v) {
						if (v) {
							$li.addClass('open');
						} else {
							$li.removeClass('open');
						}
					});

				},
				setResourceEvents = function(id, $b, $inp) {
					resources.get(id).enabled.subscribe(function(v) {
						if (!v) {
							$b.addClass('disabled');
						} else {
							$b.removeClass('disabled');
						}
					});
					$inp.click(function() {
						var incl = resources.get(id).enabled();
						resources.get(id).enabled(!incl);
					});
				};
			return function(o) {
				if (o.name != 'hidden') {
					// Collection
					collections.add('collection-' + idCollection);
					var $liCollection = $('<div class="playground-list-li" data-id="collection-' + idCollection + '"/>').appendTo($list);
					var $titleCollection = $('<div class="playground-list-tit"><i class="fa fa-caret-right"></i><i class="fa fa-caret-down"></i></div>').appendTo($liCollection),
						$inputCollection = $('<span class="pg-input"><i class="fa fa-check"></i></span>').appendTo($titleCollection),
						$textRes = $('<span class="pg-pre-input">' + o.name + '</span>').appendTo($titleCollection);
					setCollectionEvents('collection-' + idCollection, $liCollection, $titleCollection, $inputCollection);


					// Resources
					var len = o.resources.length;
					for (var i = 0; i < len; i++) {
						resources.add('resource-' + idResource, o.resources[i]);
						collections.get('collection-' + idCollection).addResource('resource-' + idResource);
						var $btnResource = $('<div class="playground-list-btn" data-id="resource-' + idResource + '"/>').appendTo($liCollection),
							$inputResource = $('<span class="pg-input"><i class="fa fa-check"></i></span>').appendTo($btnResource),
							$titleResource = $('<span class="pg-pre-input">' + resources.get('resource-' + idResource).title + '</span>').appendTo($btnResource);
						setResourceEvents('resource-' + idResource, $btnResource, $inputResource);
						idResource++;
					}
					idCollection++;
				}
			};
		})();

		for (var a in map) {
			renderList(map[a]);
		};

		// **********************************
		var $playgroundContainer = $('#playground-container');
		collections.each(function(collection) {
			var $containerCollection = $('<div class="playground-collection-container" id="' + collection.id + '"/>').appendTo($playgroundContainer);

			collection.open.subscribe(function(v) {
				if (v) {
					$containerCollection.addClass('open');
				} else {
					$containerCollection.removeClass('open');
				}
			});

			var setResourceEvents = function(res, $cont) {
				res.enabled.subscribe(function(v) {
					if (v) {
						$cont.show();
					} else {
						$cont.hide();
					}
				});
			};
			var le = collection.list.length;
			for (var i = 0; i < le; i++) {
				var resource = collection.list[i];
				var $containerResource = $('<div class="playground-resource-container" id="' + resource.id + '-html"/>').appendTo($containerCollection);
				setResourceEvents(resource, $containerResource);

			};
		});

		var loadResource = function(r) {
			if(r.html){
				$.ajax({
					url:'create/html/'+r.file+'.html',
					success:function(d){
						$('#'+r.id+'-html').html(d);
					}
				});
			}
		}
		resources.each(function(resource) {
			loadResource(resource);
		});



		collections.get('collection-0').open(true);
	});
})(jQuery, mapResources);