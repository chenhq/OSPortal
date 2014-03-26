jQuery(function($) {
	
		function initialize(options)
		{
				var opts = $.extend(true, {}, defaults, options);
				return this.each(function () {
						var $this = $(this);
						$this.addClass('tableactionable');
						$this.data('options', opts);
						$this.data('IDSelected', []);
						$this.data('IDProcessing', {});
						addOperation($this, opts);
						initDataTable($this, opts);
						
				});
		}

		$.fn.tableActionable = function (method)
		{
				if ($.fn.tableActionable[method])
				{
						return $.fn.tableActionable[method].apply(this, Array.prototype.slice.call(arguments, 1));
				}
				else if (typeof method === "object" || !method)
				{
						return initialize.apply(this, arguments);
				}
				else
				{
						$.error("Method " + method + " does not exist on jQuery.tableActionable");
				}
		};

		var defaults = $.fn.tableActionable.defaults = {
				btnClass           : "op-btn",
				tableClass         : "table",
				modalClass         : "modal",
				ajaxBaseURL        : "/",
				ajaxSuccessCallback: function() { 
						console.log('ajax success!'); },
				ajaxErrorCallback  : function() {
						console.log('ajax error!'); },
				updatetimes        : 7,
				datatable: {
						"sAjaxDataProp": "",
						"fnDrawCallback": function( oSettings ) {
								icheck = $(this).find('input[name=id]');

								icheck.iCheck({
										checkboxClass: 'icheckbox_square-yellow',
										radioClass: 'iradio_square-yellow',
										increaseArea: '20%' // optional
								});
								icheck.on('ifChecked', function(event){
										var new_item = {};
										new_item["id"] = $(this).val();
										new_item["name"] = $(this).parents('tr').find('td:eq(1) a.name').text();
										var tableActionable = $(this).parents('.tableactionable');
										var IDSelected = tableActionable.data('IDSelected');
										// index = jQuery.inArray(id, IDSelected);
										// if ( index === -1 ) {
										// 		IDSelected.push(id);
										// 		tableActionable.data('IDSelected', IDSelected);
										// }
										// if ( IDSelected.length > 0 ) {
										// 		opts = tableActionable.data('options');
										// 		tableActionable.find('.' + opts.btnClass + '.disabled').removeClass("disabled");
										// }
										
										console.log(IDSelected);
										var find = false;
										$.each(IDSelected, function(index, item) {
												if ( item["id"] == new_item["id"] ) {
														return find = true }
										});
										if (!find) {	
												IDSelected.push(new_item); }

										console.log(IDSelected);
										tableActionable.data('IDSelected', IDSelected);
										opts = tableActionable.data('options');
										tableActionable.find('.' + opts.btnClass + '.disabled').removeClass("disabled");
										
								});

								icheck.on('ifUnchecked', function(event){
										var new_item = {};
										new_item["id"] = $(this).val();
										var tableActionable = $(this).parents('.tableactionable');
										var IDSelected = tableActionable.data('IDSelected');
										$.each(IDSelected, function(index, item) {
												if (item["id"] == new_item["id"]) {
														IDSelected.splice(index, 1);
												}
										});
										// index = jQuery.inArray(id, IDSelected);
										// if ( index !== -1 ) {
										// 		IDSelected.splice(index, 1 );
										// 		tableActionable.data('IDSelected', IDSelected);
										// }
										if ( IDSelected.length < 1 ) {
												tableActionable.find('.' + tableActionable.data('options').btnClass).addClass("disabled");
										};
										//TODO
										// delete IDSelected[id];
										// if ( Object.keys(IDSelected).length > 0 ) {
										// 		tableActionable.find('.' + tableActionable.data('options').btnClass).addClass("disabled");
										// }

								});
								
								tableActionable = $(this).parents('.tableactionable');
								IDSelected = tableActionable.data("IDSelected");
								// for ( var i = 0; i < IDSelected.length; i = i + 1 ) {
								// 		var checkbox_selector = 'input[value=' + IDSelected[i] + ']';
								// 		tableActionable.find(checkbox_selector).iCheck('check');
								// }

								$.each(IDSelected, function(index, item) {
										var checkbox_selector = 'input[value=' + item["id"] + ']';
										tableActionable.find(checkbox_selector).iCheck('check');
								});

								// re init instSelected
						}
				}
		}
				
		function addOperation(tableActionable, options) {
				// var modal_btn = tableActionable.find('.' + options.ModalBTNClass);
				var IDSelected = tableActionable.data('IDSelected');
				var modals = tableActionable.find('.' + options.modalClass);
				$.each(modals, function(index, modal) {
						console.log(modal.id);
						$('#' + modal.id).on('show.bs.modal', function (e) {
								console.log('xxxxx');
								console.log($(this));
								console.log(IDSelected);
								
								$(this).find('.modal-checkboxes').html($('#tmpl-modal-checkbox').tmpl(IDSelected));
								
								icheck = $(this).find('input[type="checkbox"]');

								icheck.iCheck({
										checkboxClass: 'icheckbox_square-yellow',
										radioClass: 'iradio_square-yellow',
										increaseArea: '20%' // optional
								});
								icheck.iCheck('check');
						});
				});

				// modal.modal('show');
				// modal.on('shown.bs.modal', function (e) {
				// 		console.log('xxxxx');
				// 		console.log($(this));
				// 		$(this).find('#tmpl-modal-checkbox').tmpl(IDSelected).appendTo($(this).find('.modal-checkboxes'));
				// });
				
				var op_btn = tableActionable.find( '.' + options.OpBTNClass);
				
				op_btn.each(function() {
						$(this).bind({
								click: function(e) {
										var tableActionable = $(this).parents('.tableactionable');
										IDSelected = tableActionable.data('IDSelected');
										var ids = [];
										$.each(IDSelected, function(index, item) {
												ids.push(item["id"]);
										});

										var action = $(this).attr("action");
										var url = options.ajaxBaseURL + action;
										console.log("ids:" + ids);
										$.ajax({
												url: url,
												dataType: 'json',
												type: 'POST',
												beforeSend: function(xhr) {
														xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
												},
												data: {'ids': ids},
												success: function(result) {
														$.each(IDSelected, function(index, el) {
																IDProcessing[el] = options.updatetimes;
																options.ajaxSuccessCallback.call(this);
														});
												},
												error: function(xhr) {
														var errors = $.parseJSON(xhr.responseText).errors;
														options.ajaxErrorCallback.call(this);
												}
										});
								}
						});
				});
		}


		function updateSelected(table, datatable, options) {
				var tableActionable = table.parents('.tableactionable');
				var IDProcessing = tableActionable.data('IDProcessing');
				var id = [];
				$.each(IDProcessing, function(key, value) {
						if ( value > 0 ) {
								id.push(key);
								IDProcessing[key] -= 1;
						} else {
								delete IDProcessing[key];
						}
						console.log(IDProcessing);
				});
				if ( id.length > 0 ) {
						$.ajax({
								url: options.ajaxBaseURL + 'show.json',
								beforeSend: function(xhr) {
										xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
								},
								data: { 'ids': id },
								dataType: 'json',
								type: 'GET',
								success: function(json) {
										$.each(json, function(index, obj) {
												console.log(obj);
												//TODO
												$.each(obj, function(index, el) {
														console.log(el);
														var checkbox_selector = 'input[name="id"][value="' + el.id + '"]';
														console.log('id:' + el.id);
														console.log(checkbox_selector);
														
														var aPos = datatable.fnGetPosition($(checkbox_selector).closest('tr').get(0));
														console.log(aPos);
														if ( el.status == 'deleted' ) {
																console.log(el.id + 'delete row ...');
																table.find(checkbox_selector).iCheck('uncheck');
																datatable.fnDeleteRow(aPos);
																console.log('before delete ..');
																console.log(IDProcessing);
																//TODO
																delete IDProcessing[el.id];
																console.log('after delete ..');
																console.log(IDProcessing);
																tableActionable.data('IDProcessing', IDProcessing);
														} else {
																console.log('not deleted');
																datatable.fnUpdate(obj, aPos);
														}

												});
										});
										

										IDSelected = tableActionable.data('IDSelected');
										$.each(IDSelected, function(index, item) {
												var checkbox_selector = 'input[value=' + item["id"] + ']';
												console.log($(checkbox_selector));
												table.find(checkbox_selector).iCheck('check');
										});

										// for ( var i = 0; i < IDSelected.length; i = i + 1 ) {
										// 		console.log('-------------------------');
										// 		var checkbox_selector = 'input[value=' + IDSelected[i] + ']';
										// 		console.log($(checkbox_selector));
										// 		table.find(checkbox_selector).iCheck('check');
										// }

								},
								error: function(xhr) {
										var errors = $.parseJSON(xhr.responseText).errors;
										console.log(errors);
										console.log("失败！");
								}
						});
				}
		}

		function initDataTable(tableActionable, options) {
				var table = tableActionable.find('.' + options.tableClass);
				var datatable = table.dataTable(options.datatable);

				var tableRefreshAll = $.timer(function() {
						datatable.fnReloadAjax();
				});

				var tableRefreshSelected = $.timer(function() {
						updateSelected(table, datatable, options);
				});
				
				IDProcessing = tableActionable.data('IDProcessing');
				setInterval(function() {
						if ( Object.keys(IDProcessing).length > 0 ) {
								if ( tableRefreshAll.isActive ) {
										tableRefreshAll.pause();
								}
								if ( ! tableRefreshSelected.isActive ) {
										tableRefreshSelected.set({time: 2000, autostart: true});
										console.log('refresh selected set 20000 and autostart...');
								}
						} else {
								if ( ! tableRefreshAll.isActive ) {
										tableRefreshAll.set({ time: 15000, autostart: true});
										console.log('refresh all set 15000 and autotart ...');
								}
								if ( tableRefreshSelected.isActive ) {
										tableRefreshSelected.pause();
								}
						}
				}, 1000);
		}
		
});
