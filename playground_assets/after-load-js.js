	/* After Load All ***********************************************/
	var afterLoadAll = function() {
		"use strict";
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

		// Parallax
		var $pEx1 = Pandora.parallax({
			id: 'parallax-example-1',
			backgroundImage: 'create/img/parallax-example-1.jpg',
			height:'full'
		});
		var $pEx2 = Pandora.parallax({
			id: 'parallax-example-2',
			backgroundImage: 'create/img/parallax-example-2.jpg',
			dimmerColor:'#00F',
			dimmerOpacity: .7
		});
	};