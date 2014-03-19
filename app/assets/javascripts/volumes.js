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
										var id = $(this).val();
										var tableActionable = $(this).parents('.tableactionable');
										var IDSelected = tableActionable.data('IDSelected');
										index = jQuery.inArray(id, IDSelected);
										if ( index === -1 ) {
												IDSelected.push(id);
												tableActionable.data('IDSelected', IDSelected);
										}
										if ( IDSelected.length > 0 ) {
												opts = tableActionable.data('options');
												tableActionable.find('.' + opts.btnClass + '.disabled').removeClass("disabled");
										}
								});

								icheck.on('ifUnchecked', function(event){
										var id = $(this).val();
										var tableActionable = $(this).parents('.tableactionable');
										var IDSelected = tableActionable.data('IDSelected');
										index = jQuery.inArray(id, IDSelected);
										if ( index !== -1 ) {
												IDSelected.splice(index, 1 );
												tableActionable.data('IDSelected', IDSelected);
										}
										if ( IDSelected.length < 1 ) {
												tableActionable.find('.' + tableActionable.data('options').btnClass).addClass("disabled");
										};
								});
								
								tableActionable = $(this).parents('.tableactionable');
								IDSelected = tableActionable.data("IDSelected");
								for ( var i = 0; i < IDSelected.length; i = i + 1 ) {
										var checkbox_selector = 'input[value=' + IDSelected[i] + ']';
										tableActionable.find(checkbox_selector).iCheck('check');
								}
								// re init instSelected
						}
				}
		}
				
		function addOperation(tableActionable, options) {
				var btn = tableActionable.find( '.' + options.btnClass);
				
				return btn.each(function() {
						$(this).bind({
								click: function(e) {
										var tableActionable = $(this).parents('.tableactionable');
										var id = tableActionable.data('IDSelected');
										var action = $(this).attr("action");
										var url = options.ajaxBaseURL + action;
										console.log("id:" + id);
										$.ajax({
												url: url,
												dataType: 'json',
												type: 'POST',
												beforeSend: function(xhr) {
														xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
												},
												data: {'ids': id},
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
														var checkbox_selector = 'input[name="id"][value="' + el.id + '"]';
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
																instTable.fnUpdate(inst, aPos);
														}

												});
										});
										
										for ( var i = 0; i < IDSelected.length; i = i + 1 ) {
												console.log('-------------------------');
												var checkbox_selector = 'input[value=' + IDSelected[i] + ']';
												console.log($(checkbox_selector));
												table.find(checkbox_selector).iCheck('check');
										}

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
		

		$('#vol-tableactionable').tableActionable( {
				btnClass: "volume_op_btn",
				ajaxBaseURL: "/volumes/",
				datatable: {
						"sAjaxSource": "/volumes.json",
						"bAutoWidth": false,
						// "bProcessing" : true,
						"aoColumns": [
								{
										"sClass": "center",
										"sWidth": "10%",
										"bSearchable": false,
										"bSortable": false,
										"mData": "volume.id",
										"mRender": function(data, type, full) {
												return '<div class="square-yellow"> <div class="checkbox"><input type="checkbox" name="id", value="'+ data + '"></div> </div>'
										}
								},
								{ 
										"sClass": "center",
										"sWidth": "10%",
										"mData": "volume.display_name",
										"mRender": function(data, type, full) {
												return '<a href="#">' + data  + '</a>'
										}
								},
								{ 
										"sClass": "center",
										"sWidth": "10%",
										"mData": "volume.status",
										"mRender": function(data, type, full) {
												var css_class, status, icon;
												switch(data.toLowerCase()) {
												case 'active':
														css_class = "btn-success";
														status = "活动";
														icon = "fa-check";
														break;
												case 'build': 
														css_class = "btn-info";
														status = "创建...";
														icon = "fa-cog fa-spin";
														break;
												case 'error': 
														css_class = "btn-error";
														status = "错误";
														icon = "fa-frown-o";
														break;
												case 'deleted': 
														css_class = "btn-error";
														status = "已删除";
														icon = "fa-frown-o";
														break;
												case 'unknown': 
														css_class = "btn-error";
														status = "异常";
														icon = "fa-frown-o";
														break;
												default: 
														css_class = "default";
														status = "未知";
														icon = "";
												}
												
 												return '<span class="btn-sm btn-block ' + css_class + '"><i class="fa ' + icon + '"></i>&nbsp' + status + '</span>'
										}
								},
								{ 
										"sClass": "center",
										"sWidth": "15%",
										"mData": "volume.size",
										"mRender": function(data, type, full) {
												return data + 'G'
										}
								},
								{ 
										"sClass": "center",
										"mWidth": "15%",					
										"mData": "volume.id",
										"mRender": function(data, type, full) {
												return data
										}
								},
								{ 
										"sClass": "center",
										"mWidth": "15%",					
										"mData": "volume.id",
										"mRender": function(data, type, full) {
												return data
										}
								},
								{ 
										"mWidth": "20%",
										"mData": "volume.display_description",
								},
								{ 
										"mWidth": "20%",
										"mData": "volume.created_at",
										"mRender": function(data, type, full) {
												return  data
										}
								}
						],
				}
		});

});
