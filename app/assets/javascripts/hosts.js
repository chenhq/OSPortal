jQuery(function($) {
		// Add fnReloadAjax function, see http://datatables.net/plug-ins/api 
		// ref: http://stackoverflow.com/questions/5566541/how-to-reload-the-datatablejquery-data
		$.fn.dataTableExt.oApi.fnReloadAjax = function ( oSettings, sNewSource, fnCallback, bStandingRedraw )
		{
				// DataTables 1.10 compatibility - if 1.10 then versionCheck exists.
				// 1.10s API has ajax reloading built in, so we use those abilities
				// directly.
				if ( $.fn.dataTable.versionCheck ) {
						var api = new $.fn.dataTable.Api( oSettings );
						
						if ( sNewSource ) {
								api.ajax.url( sNewSource ).load( fnCallback, !bStandingRedraw );
						}
						else {
								api.ajax.reload( fnCallback, !bStandingRedraw );
						}
						return;
				}
				
				if ( sNewSource !== undefined && sNewSource !== null ) {
						oSettings.sAjaxSource = sNewSource;
				}
				
				// Server-side processing should just call fnDraw
				if ( oSettings.oFeatures.bServerSide ) {
						this.fnDraw();
						return;
				}
				
				this.oApi._fnProcessingDisplay( oSettings, true );
				var that = this;
				var iStart = oSettings._iDisplayStart;
				var aData = [];
				
				this.oApi._fnServerParams( oSettings, aData );
				
				oSettings.fnServerData.call( oSettings.oInstance, oSettings.sAjaxSource, aData, function(json) {
						/* Clear the old information from the table */
						that.oApi._fnClearTable( oSettings );
						
						/* Got the data - add it to the table */
						var aData =  (oSettings.sAjaxDataProp !== "") ?
								that.oApi._fnGetObjectDataFn( oSettings.sAjaxDataProp )( json ) : json;
						
						for ( var i=0 ; i<aData.length ; i++ )
						{
								that.oApi._fnAddData( oSettings, aData[i] );
						}
						
						oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
						
						that.fnDraw();
						
						if ( bStandingRedraw === true )
						{
								oSettings._iDisplayStart = iStart;
								that.oApi._fnCalculateEnd( oSettings );
								that.fnDraw( false );
						}
						
						that.oApi._fnProcessingDisplay( oSettings, false );
						
						/* Callback user function - for event handlers etc */
						if ( typeof fnCallback == 'function' && fnCallback !== null )
						{
								fnCallback( oSettings );
						}
				}, oSettings );
		};

		
		    $('#images-table').dataTable( {
        "aoColumnDefs": [
            { "bSortable": false, "aTargets": [ 0 ] }
        ],
        "aaSorting": [ [1,'desc'], [5, 'desc']],
				"aLengthMenu": [[6, 10, 20, -1], [6,  10, 20, "All"]],
				"iDisplayLength": 6
		} );

    // /*
    //  * Insert a 'details' column to the table
    //  */
    // var nCloneTh = document.createElement( 'th' );
    // var nCloneTd = document.createElement( 'td' );
    // nCloneTd.innerHTML = '<img src="/assets/details_open.png">';
    // nCloneTd.className = "center";

    // $('#hidden-table-info thead tr').each( function () {
    //     this.insertBefore( nCloneTh, this.childNodes[0] );
    // } );

    // $('#hidden-table-info tbody tr').each( function () {
    //     this.insertBefore(  nCloneTd.cloneNode( true ), this.childNodes[0] );
    // } );

    /*
     * Initialse DataTables, with no sorting on the 'details' column
     */
		var aSelected = [];
    var oTable = $('#hidden-table-info').dataTable( {
        "aoColumnDefs": [
            { "bSortable": false, "aTargets": [ 0 ] },
						{"sWidth": "6em", "aTargets": [0] }
        ],
        "aaSorting": [ [1, 'asc'], [2, 'asc'], [3, 'asc'], [4, 'asc'] ]
    });

		var instSelected = [];
		var instProcessing = {};
		var instTable = $('#inst-table').dataTable( {
				"sAjaxSource": "/hosts.json",
				"bAutoWidth": false,
				// "bProcessing" : true,
				"aoColumns": [
						{
								"sClass": "center",
								"sWidth": "10%",
								"bSearchable": false,
								"bSortable": false,
								"mData": "server.id",
								"mRender": function(data, type, full) {
										return '<div class="square-yellow"> <div class="checkbox"><input type="checkbox" name="instanceid", value="'+ data + '"></div> </div>'
								}
						},
						{ 
								"sClass": "center",
								"sWidth": "10%",
								"mData": "server.name",
								"mRender": function(data, type, full) {
										return '<a class="hostname" href="#">' + data  + '</a>'
								}
						},
						{ 
								"sClass": "center",
								"sWidth": "10%",
								"mData": "server.status",
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
										case 'hard_reboot': 
												css_class = "btn-info";
												status = "重启...";
												icon = "fa-cog fa-spin";
												break;
										case 'reboot': 
												css_class = "btn-info";
												status = "重启...";
												icon = "fa-cog fa-spin";
												break;
										case 'password': 
												css_class = "btn-info";
												status = "重置密码...";
												icon = "fa-cog fa-spin";
												break;
										case 'rebuild': 
												css_class = "btn-info";
												status = "重建...";
												icon = "fa-cog fa-spin";
												break;
										case 'resize': 
												css_class = "btn-info";
												status = "配置升级...";
												icon = "fa-cog fa-spin";
												break;
										case 'revert_resize': 
												css_class = "btn-info";
												status = "配置回退...";
												icon = "fa-cog fa-spin";
												break;
										case 'verify_resize': 
												css_class = "btn-info";
												status = "升级检查...";
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
										case 'shutoff': 
												css_class = "btn-warning";
												status = "关机";
												icon = "fa-warning";
												break;
										case 'suspended': 
												css_class = "btn-warning";
												status = "暂停";
												icon = "fa-warning";
												break;
										case 'paused': 
												css_class = "btn-warning";
												status = "暂停";
												icon = "fa-warning";
												break;
										case 'rescue': 
												css_class = "btn-info";
												status = "救援模式";
												icon = "fa-warning";
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
								"mData": "server.nets",
								"mRender": function(nets, type, full) {
										var fixed_ip = [];
										$.each(nets, function(index, net) {
												$.each(net.net.addresses, function(index, address) {
														for(var name in address.address) {
																if ( name == "OS-EXT-IPS:type" && address.address[name] == "fixed" ) {
																		fixed_ip.push(address.address.addr);
																}
														}
												});
										});
										return fixed_ip
								}
						},
						{ 
								"sClass": "center",
								"mWidth": "15%",					
								"mData": "server.nets",
								"mRender": function(nets, type, full) {
										var floating_ip = [];
										$.each(nets, function(index, net) {
												$.each(net.net.addresses, function(index, address) {
														for(var name in address.address) {
																if ( name == "OS-EXT-IPS:type" && address.address[name] == "floating" ) {
																		floating_ip.push(address.address.addr);
																}
														}
												});
										});
										return floating_ip
								}
						},
						{ 
								"mWidth": "20%",
								"mData": "server.image",
								"mRender": function(data, type, full) {
										return '<a href="#">' + data.name + '</a>'
								}
						},
						{ 
								"mWidth": "20%",
								"mData": "server.flavor",
								"mRender": function(data, type, full) {
										return '<a href="#">' + 'CPU:'+ data.vcpus + '核 &nbsp;内存:' + data.ram/1024 + 'G &nbsp硬盘:' + data.disk + 'G'+ '</a>'
								}
						}
					],
				 "sAjaxDataProp": "",
				 "fnDrawCallback": function( oSettings ) {
						 $('#inst-table input').iCheck({
								 checkboxClass: 'icheckbox_square-yellow',
								 radioClass: 'iradio_square-yellow',
								 increaseArea: '20%' // optional
						 });
						 $('#inst-table input[name="instanceid"]').on('ifChecked', function(event){
								 var instanceid = $(this).val();
								 index = jQuery.inArray(instanceid, instSelected);
								 if ( index === -1 ) {
										 instSelected.push(instanceid);
								 }
								 console.log(instSelected);
								 if ( instSelected.length > 0 ) {
										 $("#inst-toolbar").find('.inst-op-btn.disabled').removeClass("disabled");
								 }
						 });

						 $('#inst-table input[name="instanceid"]').on('ifUnchecked', function(event){
								 var instanceid = $(this).val();
								 index = jQuery.inArray(instanceid, instSelected);
								 if ( index !== -1 ) {
										 instSelected.splice(index, 1 );
								 }
								 console.log(instSelected);
								 if ( instSelected.length < 1 ) {
										 $("#inst-toolbar").find('.inst-op-btn').addClass("disabled");
								 };
						 });

						 for ( var i = 0; i < instSelected.length; i = i + 1 ) {
								 var checkbox_selector = '#inst-table input[value=' + instSelected[i] + ']';
								 console.log($(checkbox_selector));
								 $(checkbox_selector).iCheck('check');
						 }
						 // re init instSelected


				 }
	 });

		 // var instTableFresh = setInterval(function() {
		 // 		instTable.fnReloadAjax();}, 15000);

		 var instTableRefreshAll = $.timer(function() {
				 instTable.fnReloadAjax();
		 });
		 // $('#inst-table').on('click', 'tr', function(){
		 // 		// var oData = instTable.fnGetData(this);
		 // 		// instTable.fnUpdate(oData, 1, undefined, true, true);
		 // 		// console.log(oData);
		 // 		var aPos = oTable.fnGetPosition(this);
		 // 		console.log(aPos);
		 // });

		 // $('#inst-table tbody tr').each( function () {
		 //     $(this).insertBefore(nCloneTd.cloneNode(true), this.childNodes[0] );
		 // } );

		 // /* Click event handler */
		 // $('#hidden-table-info tbody tr').on('click', function () {
		 //     var id = this.id;
		 //     var index = jQuery.inArray(id, aSelected);

		 //     if ( index === -1 ) {
		 //         aSelected.push( id );
		 //     } else {
		 //         aSelected.splice(index, 1 );
		 //     }
		 //     console.log(aSelected);
		 //     $(this).toggleClass('row_selected');
		 // } );

		 /* Add event listener for opening and closing details
			* Note that the indicator for showing which row is open is not controlled by DataTables,
			* rather it is done here
			*/
		 // $(document).on('click','#inst-table td a.hostname',function(e) {
		 // 		e.preventDefault();
		 // 		console.log(e);
		 // 		console.log('xx');
		 //     var nTr = $(this).parents('tr')[0];
		 //     if ( instTable.fnIsOpen(nTr) )
		 //     {
		 //         /* This row is already open - close it */
		 //         // this.src = "/assets/details_open.png";
		 //         instTable.fnClose( nTr );
		 //     }
		 //     else
		 //     {
		 //         /* Open this row */
		 //         // this.src = "/assets/details_close.png";
		 //         instTable.fnOpen( nTr, fnFormatDetails(instTable, nTr), 'details' );
		 //     }
		 // } );

		 // // 隐藏第二步骤信息
		 // $("#host_create_step2").hide();
		 // $("#step2_btns").hide();

		 // // 下一步
		 // $("#step1_btn").click(function() {
		 // 		$("#host_create_step1").hide();
		 // 		$("#step1_btns").hide();
		 // 		$("#host_create_step2").show();
		 // 		$("#step2_btns").show();

		 // });

		 // // 上一步
		 // $("#step2_btn_pre").click(function() {
		 // 		$("#host_create_step2").hide();
		 // 		$("#step2_btns").hide();
		 // 		$("#host_create_step1").show();
		 // 		$("#step1_btns").show();
		 // });

		 // //数据盘slider
		 // $("#datadisk_space_slider").slider();

		 // $(function() {
		 // 		$( "#datadisk_space_slider" ).slider({
		 // 				value: 80,
		 // 				min: 5,
		 // 				max: 1000,
		 // 				step: 5,
		 // 				slide: function( event, ui ) {
		 // 						$( "#datadisk_space" ).val(ui.value);
		 // 						$( "#datadisk_space-selected" ).val(ui.value);
		 // 				}
		 // 		});
		 // 		$( "#datadisk_space" ).val($( "#datadisk_space_slider" ).slider( "value" ) );
		 // 		$( "#datadisk_space-selected" ).val($( "#datadisk_space_slider" ).slider( "value" ) );

		 // });

		 // //带宽slider
		 // $("#bandwidth_slider").slider();

		 // $(function() {
		 // 		$( "#bandwidth_slider" ).slider({
		 // 				value:10,
		 // 				min: 1,
		 // 				max: 1000,
		 // 				step: 1,
		 // 				slide: function( event, ui ) {
		 // 						$( "#bandwidth" ).val(ui.value);
		 // 						$( "#bandwidth-selected" ).val(ui.value);
		 // 				}
		 // 		});
		 // 		$( "#bandwidth" ).val($( "#bandwidth_slider" ).slider( "value" ) );
		 // 		$( "#bandwidth-selected" ).val($( "#bandwidth_slider" ).slider( "value" ) );
		 // });

		 // //os select
		 // $("#image_list .btn").click(function() {
		 // 		$("#image-selected").val($(this).text().trim());
		 // 		$("#image-selected").data("imageid", $(this).data("imageid"));
		 // 		osfamily = $(this).data("osfamily").trim().toLowerCase();
		 // 		ostype = $(this).data("ostype").trim().toLowerCase();

		 // 		if (  osfamily == "linux" ) {
		 // 				if ( ostype == "ubuntu" ) {
		 // 						$("#username").val("ubuntu");
		 // 				}
		 // 				else {
		 // 						$("#username").val("root");
		 // 				}
		 // 		}
		 // 		else if (osfamily == "windows" ){
		 // 				$("#username").val("administrator");
		 // 		}
		 // 		else {
		 // 				$("#username").val("默认用户");
		 // 		}

		 // }); 
		 // $("#cpu_list .btn").click(function() {
		 // 		$("#cpu-selected").val($(this).text().trim());
		 // 		$("#cpu-selected").data("value", $(this).data("value"));
		 // }); 
		 // $("#mem_list .btn").click(function() {
		 // 		$("#mem-selected").val($(this).text().trim());
		 // 		$("#mem-selected").data("value", $(this).data("value"));
		 // }); 


		 // $("#cpu-selected").val($("#cpu_list .active").text());
		 // $("#cpu-selected").data("value", $("#cpu_list .active").data("value"));
		 // $("#mem-selected").val($("#mem_list .active").text());
		 // $("#mem-selected").data("value", $("#mem_list .active").data("value"));

		 // $("#OSdisk-selected").val("30");
		 // $("#image-selected").val($("#image_list .active .active").text());

		 // function hostcreate(e) {
		 // 		e.preventDefault();

		 // 		var imageid         = $('#image-selected').data("imageid");
		 // 		var cpu             = $('#cpu-selected').data("value");
		 // 		var mem             = $('#mem-selected').data("value")
		 // 		var OSdisk          = $('#OSdisk-selected').val();
		 // 		var datadisk_space  = $('#datadisk_space-selected').val();
		 // 		var bandwidth       = $('#bandwith-selected').val();
		 // 		var hostname        = $('#hostname').val();
		 // 		var username        = $('#username').val();
		 // 		var password        = $('#password').val();
		 // 		$.ajax({
		 // 				url: '/hosts',
		 // 				data: { 'imageid': imageid, 'cpu': cpu, 'mem': mem, 'OSdisk': OSdisk, 'datadisk_space': datadisk_space, 'bandwidth': bandwidth , 'hostname': hostname, 'password': password},
		 // 				dataType: 'json',
		 // 				type: 'POST',
		 // 				success: function(result) {
		 // 						alert("创建成功！");
		 // 						window.location = "/hosts"
		 // 				},
		 // 				error: function(xhr) {
		 // 						var errors = $.parseJSON(xhr.responseText).errors;
		 // 						alert("创建失败，请联系管理员！");
		 // 				}
		 // 		});
		 // }

		 // $('#step2_btn_commit').click(hostcreate);

		 // $(".host_popovers").popover();

		 // // 镜像选择，默认选择地一个tab页
		 // $("#os_type_list li:eq(3) a").tab('show');

		 $('input[name="serverids"]').click(function() { 
				 $(".btn-toolbar .btn").removeAttr("disabled");
				 inst_name = $(this).attr("hostname");
				 inst_id = $(this).val();
				 $('input[name="image_create_host"]').val(inst_name);
				 $('input[name="img-create-instance-id"]').val(inst_id);
		 });

		 $('#inst-table input').on('ifChecked', function(event){
				 //$(".btn-toolbar .btn").removeAttr("disabled");
				 alert(event.type + ' callback');
		 });




		 // function getSelectedInstanceIds() {
		 // 		var ids = [];
		 // 		$('#inst-table input[name="instanceid"]:checked').each(function() { 
		 // 				ids.push($(this).val());
		 // 		})
		 // 		console.log(ids);
		 // 		return ids;	
		 // }

		 var times_of_update = 7;
		 $.fn.addInstanceOperation = function() {
				 return this.bind({
						 click: function(e) {
								 // var ids = getSelectedInstanceIds();
								 console.log(instSelected);
								 var action = $(this).attr("action");
								 url = "/hosts/" + action;
								 $.ajax({
										 url: url,
										 beforeSend: function(xhr) {
												 xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
										 },
										 data: { 'instanceids': instSelected },
										 dataType: 'json',
										 type: 'POST',
										 success: function(result) {
												 $.each(instSelected, function(index, instance) {
														 instProcessing[instance] = times_of_update;
												 });
												 if ( action == "emergency_login" ) {
														 console.log("emergency_login");
														 console.log(result);
														 $.each(result, function(index, el) {
																 console.log(el);
																 window.open(el, '_blank');
														 });
												 }
												 else { 
														 // if ( action == "delete" ) {
														 // 		console.log('delete action');
														 // 		// instProcessing = {};
														 // 		$.each(instSelected, function(index, id) {
														 // 				console.log(id);
														 // 				var checkbox_selector = '#inst-table input[name="instanceid"][value="' + id + '"]';
														 // 				console.log(checkbox_selector);
														 // 				$(checkbox_selector).iCheck('uncheck');
														 // 				var aPos = instTable.fnGetPosition($(checkbox_selector).closest('tr').get(0));
														 // 				console.log(aPos);
														 // 				console.log('delete......');
														 // 				// instTable.fnDeleteRow(aPos);
														 // 		});
														 // 		// instSelected = [];
														 // 		// $('#inst-table input[name="instanceid"]').iCheck('uncheck');
														 // }
														 alert("命令执行成功！");
												 }
										 },
										 error: function(xhr) {
												 var errors = $.parseJSON(xhr.responseText).errors;
												 alert("命令执行失败！");
										 }
								 });
						 }
				 })
		 };

		 // check instance changes
		 function updateInstances() {
				 console.log('enter update ....');
				 var instances = [];
				 if ( Object.keys(instProcessing).length > 0 ) {
						 $.each(instProcessing, function(key, value) {
								 if ( value > 0 ) {
										 instances.push(key);
										 instProcessing[key] -= 1;
								 } else {
										 delete instProcessing[key];
								 }
								 console.log('processing..');
								 console.log(instProcessing);
						 });
						 if ( instances.length > 0 ) {
								 $.ajax({
										 url: '/hosts/show.json',
										 beforeSend: function(xhr) {
												 xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
										 },
										 data: { 'instanceids': instances },
										 dataType: 'json',
										 type: 'GET',
										 success: function(json) {
												 console.log('update instances...');
												 $.each(json, function(index, inst) {
														 console.log(inst);
														 var checkbox_selector = '#inst-table input[name="instanceid"][value="' + inst.server.id + '"]';
														 console.log(checkbox_selector);
														 
														 var aPos = instTable.fnGetPosition($(checkbox_selector).closest('tr').get(0));
														 console.log(aPos);
														 if ( inst.server.status == 'deleted' ) {
																 console.log(inst.server.id + 'delete row ...');
																 $(checkbox_selector).iCheck('uncheck');
																 instTable.fnDeleteRow(aPos);
																 console.log('before delete ..');
																 console.log(instProcessing);
																 delete instProcessing[inst.server.id];
																 console.log('after delete ..');
																 console.log(instProcessing);
														 } else {
																 console.log('not deleted');
																 instTable.fnUpdate(inst, aPos);
														 }
												 });
												 
												 for ( var i = 0; i < instSelected.length; i = i + 1 ) {
														 console.log('-------------------------');
														 var checkbox_selector = '#inst-table input[value=' + instSelected[i] + ']';
														 console.log($(checkbox_selector));
														 $(checkbox_selector).iCheck('check');
												 }

												 console.log(json[0].server.id);
												 console.log(json);
										 },
										 error: function(xhr) {
												 var errors = $.parseJSON(xhr.responseText).errors;
												 console.log(errors);
												 console.log("失败！");
										 }
								 });
						 }
				 }
		 }

		 // updateInstancesInterval = setInterval(updateInstances, 2000);		
		 instTableRefreshSelected = $.timer(updateInstances);

		 setInterval(function() {
				 if ( Object.keys(instProcessing).length > 0 ) {
						 if ( instTableRefreshAll.isActive ) {
								 instTableRefreshAll.pause();
						 }
						 if ( ! instTableRefreshSelected.isActive ) {
								 instTableRefreshSelected.set({time: 2000, autostart: true});
								 console.log('refresh selected set 20000 and autostart...');
						 }
				 } else {
						 if ( ! instTableRefreshAll.isActive ) {
								 instTableRefreshAll.set({ time: 15000, autostart: true});
								 console.log('refresh all set 15000 and autotart ...');
						 }
						 if ( instTableRefreshSelected.isActive ) {
								 instTableRefreshSelected.pause();
						 }
				 }

		 }, 1000);

		 $("#inst-toolbar .inst-op-btn[action]").addInstanceOperation();

		 $.fn.addSelectable = function(options) {
				 var defaults = {
						 callback: function() {}
				 };

				 var options = $.extend(defaults, options);

				 return this.bind('click', function() {
						 options.callback(this);
						 $(this).parent().find('.selected').removeClass('selected');
						 $(this).addClass('selected');
						 console.log(this);
				 });
		 };

		 var showInstanceOptions = {

				 public_images: null,

				 init : function() {
						 // $('#rootwizard').on('shown', showInstanceOptions.showAll);

						 // images
						 // $('.ostypes').delegate('a[data-owner="public"]', 'click', showInstanceOptions.showPublicImages);
						 // $('.ostypes').delegate('a[data-owner="private"]', 'click', showInstanceOptions.showPrivateImages);

				 },

				 showAll : function() {
						 // showInstanceOptions.showOSTypes();
						 showInstanceOptions.showFlavors();
				 },

				 // showOSTypes: function() {
				 // 		$('.ostypes a[data-owner!="private"]').remove();
				 // 		ostypes = $.ajax('/os_types.json',{
				 // 				cache: true,
				 // 				async: false,
				 // 				complete: function() {
				 // 						console.log('complete get os types');
				 // 				},

				 // 				success: function(ostypes) {
				 // 						$("#tmpl-ostypes").tmpl(ostypes).appendTo('.ostypes');
				 // 				},
				 // 				error: function() {
				 // 						alert('can not get os types');
				 // 				}
				 // 		})
				 // 		$('.ostypes .ostype').addSelectable();						
				 // 		$('.ostypes .ostype:eq(1)').trigger('click');
				 // },

				 // showPublicImages: function(e) {
				 // 		console.log('enter show public images');
				 // 		e.preventDefault();
				 // 		console.log($(this).text());
				 // 		var ostypeid = $(this).data('id');
				 // 		console.log('id:');
				 // 		console.log(ostypeid);
				 // 		$('.images').empty();
				 // 		if (showInstanceOptions.public_images==null) {
				 // 				$.ajax('/operating_systems.json',{
				 // 						cache: true,
				 // 						async: false,
				 // 						complete: function() {
				 // 								console.log('complete get images');
				 // 						},

				 // 						success: function(images) {
				 // 								showInstanceOptions.public_images = images;
				 // 						},

				 // 						error: function() {
				 // 								alert('can not get images');
				 // 						}

				 // 				});
				 // 		};
				 // 		var filtered_images = [];
				 // 		$.each(showInstanceOptions.public_images, function(index, image) {
				 // 				if (image.os_type_id==ostypeid) {
				 // 						filtered_images.push(image);
				 // 				}
				 // 		});
				 // 		$('#tmpl-public-images').tmpl(filtered_images).appendTo('.images');
				 // 		$('.images .image').addSelectable();
				 // 		$('.images .image:first').click();
				 // },

				 // showPrivateImages: function() {
				 // 		$('.images').empty();
				 // 		$.ajax('/images.json',{
				 // 				cache: false,
				 // 				async: false,
				 // 				complete: function() {
				 // 				},

				 // 				success: function(images) {
				 // 						$('#tmpl-private-images').tmpl(images).appendTo('.images');
				 // 				},
				 // 				error: function() {
				 // 						alert('can not get images');
				 // 				}
				 // 		});

				 // 		$('.images .image').addSelectable();
				 // 		$('#images .image:first').click();
				 // },

				 showFlavors: function() {
						 $('.flavors .flavor-item').remove();
						 $('.cpus .cpu').remove();
						 $('.memories .memory').remove();

						 flavors = $.ajax('/flavors.json',{
								 cache: true,
								 async: false,
								 complete: function() {
										 console.log('complete get flavors');
								 },

								 success: function(flavors) {
										 var named_flavors = [];
										 var uniq_cpus = [];
										 var uniq_memories =[];
										 $.each(flavors, function(index, flavor) {
												 if (flavor.alias != 'unkown') {
														 named_flavors.push(flavor);
												 }
												 if (($.inArray(flavor.vcpus, uniq_cpus)) == -1) {
														 uniq_cpus.push(flavor.vcpus);
												 }
												 if (($.inArray(flavor.memory_mb, uniq_memories)) == -1) {
														 uniq_memories.push(flavor.memory_mb);
												 }

										 });


										 named_flavors.sort(function(a,b) {
												 if ( a.vcpus == b.vcpus) {
														 return a.memory_mb - b.memory_mb;
												 } else {
														 return a.vcpus - b.vcpus;
												 }
										 });

										 uniq_cpus.sort(function(a,b){
												 return a-b;
										 });

										 uniq_memories.sort(function(a,b){
												 return a-b;
										 });

										 //console.log(named_flavors);
										 //console.log(uniq_cpus);
										 //console.log(uniq_memories);

										 $('.flavors .flavor').remove();

										 $("#tmpl-flavors").tmpl(named_flavors).appendTo('.flavors');

										 var cpus = $.map(uniq_cpus, function(cpu) {
														 return '<div class="cpu" data-value="' + cpu + '">' + cpu +'核</div>'
										 });
										 $('.cpus').html(cpus.join(''));

										 var memories = $.map(uniq_memories, function(memory) {
														 return '<div class="memory" data-value="' + memory + '">' + memory/1024 +'G</div>'
										 });
										 $('.memories').html(memories.join(''));

										 // add selectable to flavor cpu memory
										 $('.memories .memory').addSelectable({
												 callback: function(memory) {
														 var memory_mb = $(memory).data('value');
														 var mem_count = memory_mb/1024;
														 var mem_perprice = $('#table-flavor-price #memory .perprice').text();
														 var mem_minute = mem_count * mem_perprice;
														 var mem_hour = mem_minute * 60;
														 var mem_day = mem_hour * 24;

														 $('#flavor-memory').val(memory_mb);

														 $('#table-flavor-price #memory .count').text(mem_count);
														 $('#table-flavor-price #memory .minute').text(mem_minute.toFixed(2));
														 $('#table-flavor-price #memory .hour').text(mem_hour.toFixed(2));
														 $('#table-flavor-price #memory .day').text(mem_day.toFixed(2));

														 $('#flavor .flavors .selected').removeClass('selected');

											 }			
										 });

										 $('.cpus .cpu').addSelectable({
												 callback: function(cpu) {
														 var vcpus = $(cpu).data('value');
														 var enable_memories = [];
														 $.each(flavors, function(index, flavor) {
																 if ( vcpus == flavor.vcpus ) {
																		 enable_memories.push(flavor.memory_mb);
																 }
														 });
														 $('.memories .memory').removeClass('selected').addClass('disabled');

														 console.log(enable_memories);
														 $.each(enable_memories, function(index, memory_mb) {
																 var memory_element = '.memories .memory[data-value=' + memory_mb + ']';
																 console.log(memory_element);
																 $(memory_element).removeClass('disabled');
														 });

														 $('.memories [class=memory]').last().click();

														 var cpu_count = vcpus;
														 var cpu_perprice = $('#table-flavor-price #cpu .perprice').text();
														 var cpu_minute = cpu_count * cpu_perprice;
														 var cpu_hour = cpu_minute * 60;
														 var cpu_day = cpu_hour * 24;

														 $('#flavor-cpu').val(cpu_count);

														 $('#table-flavor-price #cpu .count').text(cpu_count);
														 $('#table-flavor-price #cpu .minute').text(cpu_minute.toFixed(2));
														 $('#table-flavor-price #cpu .hour').text(cpu_hour.toFixed(2));
														 $('#table-flavor-price #cpu .day').text(cpu_day.toFixed(2));

														 $('#flavor .flavors .selected').removeClass('selected');
												 }
										 });

										 $('.flavors .flavor').addSelectable({
												 callback: function(flavor) {
														 var alias = $(flavor).find('h6').text();

														 var vcpus, memory_mb;
														 $.each(named_flavors, function(index, flavor) {
																 if ( alias == flavor.alias ) {
																		 vcpus = flavor.vcpus;
																		 return;
																 }
														 });

														 $.each(named_flavors, function(index, flavor) {
																 if ( alias == flavor.alias ) {
																		 memory_mb = flavor.memory_mb;
																		 return;
																 }
														 });

														 var cpu_element = '.cpus .cpu[data-value=' + vcpus + ']';
														 var memory_element = '.memories .memory[data-value=' + memory_mb + ']';
														 $(cpu_element).trigger('click');
														 $(memory_element).trigger('click');

														 console.log('alias:');
														 console.log(alias);
														 console.log(vcpus);
														 console.log(memory_mb);


												 }
										 });

								 },

								 error: function() {
										 alert('can not get flavors');
								 }
						 });
						 $('.flavors .inner:eq(3)').click();
				 },


		 }

		 showInstanceOptions.init();

		 // $('#create-instance-form').easyWizard({
		 // 		stepsText: '{t} {n}',
		 // 		prevButton: '上一步',
		 // 		nextButton: '下一步',
		 // 		submitButtonText: '创建主机',
		 // 		buttonsClass: 'btn',
		 // 		submitButtonClass: 'btn btn-primary'
		 // });


		 // Root Wizard Current Tab
		 function setCurrentProgressTab($rootwizard, $nav, $tab, $progress, index) {
				 $tab.prevAll().addClass('completed');
				 $tab.nextAll().removeClass('completed');

				 var items      	  = $nav.children().length,
				 pct           = parseInt((index+1) / items * 100, 10),
				 $first_tab    = $nav.find('li:first-child'),
				 margin        = (1/(items*2) * 100) + '%';//$first_tab.find('span').position().left + 'px';

				 if( $first_tab.hasClass('active'))
				 {
						 $progress.width(0);
				 }
				 else
				 {
						 $progress.width( ((index) /(items-1)) * 100 + '%' ); //$progress.width( $tab.prev().position().left - $tab.find('span').width()/2 );
				 }


				 $progress.parent().css({
						 marginLeft: margin,
						 marginRight: margin
				 });

	 /*var m = $first_tab.find('span').position().left - $first_tab.find('span').width() / 2;

	 $rootwizard.find('.tab-content').css({
		 marginLeft: m,
		 marginRight: m
	 });*/
		 }


		 // Form Wizard
		 if($.isFunction($.fn.bootstrapWizard))
		 {
				 $(".form-wizard").each(function(i, el) {
						 var $this = $(el),				
						 $progress = $this.find(".steps-progress div"),
						 _index = $this.find('> ul > li.active').index();

						 // Validation
						 var checkFormWizardValidaion = function(tab, navigation, index)
						 {
								 if($this.hasClass('validate')) {
										 var $valid = $this.valid();

										 if( ! $valid)
										 {
												 $this.data('validator').focusInvalid();
												 return false;
										 }
								 }

								 return true;
						 };


						 $this.bootstrapWizard({
								 tabClass: "",
								 onTabShow: function($tab, $navigation, index)
								 {
										 setCurrentProgressTab($this, $navigation, $tab, $progress, index);

										 var $total = $navigation.find('li').length;
										 var $current = index+1;
										 if($current >= $total) {
												 $($this).find('.pager .next').hide();
												 $($this).find('.pager .finish').show();
												 $($this).find('.pager .finish').removeClass('disabled');
										 } 
										 else {
												 $($this).find('.pager .next').show();
												 $($this).find('.pager .finish').hide();
										 }
								 },

								 onNext: checkFormWizardValidaion,
								 onTabClick: checkFormWizardValidaion,
								 onShow: showInstanceOptions.showAll
						 });

						 $this.data('bootstrapWizard').show( _index );

						 /*$(window).on('neon.resize', function()
							 {
							 $this.data('bootstrapWizard').show( _index );
							 });*/
				 });
		 };


		 // validate signup form on keyup and submit
		 $("#inst-wizard-form").validate({
				 rules: {
						 hostname: {
								 required: true,
								 rangelength: [2, 20]
						 },

						 hostnum: {
								 required: true,
								 range: [1,10]
						 },

						 password: {
								 required: true,
								 rangelength: [6, 20]
						 },
						 confirm_password: {
								 required: true,
								 rangelength: [6, 20],
								 equalTo: "#password"
						 }
				 }
				 // messages: {
				 //     hostname: {
				 // 				required: "请输入主机名称",
				 // 				rangelength: "主机名称的最小长度为2，最大长度为20"
				 // 		},
				 //     hostnum: {
				 //         required: "请输入创建主机的数量",
				 //         range: "每次创建的主机数量应大于0小于10"
				 //     },
				 //     password: {
				 //         required: "请输入密码",
				 //         rangelength: "密码的长度必须大于6，小于20"
				 //     },
				 //     confirm_password: {
				 //         required: "请输入确认密码",
				 //         rangelength: "密码的长度必须大于6，小于20",
				 //         equalTo: "确认密码必须和密码相同"
				 //     },
				 // }
		 });

		 $('#create_instance_commit').click(function(e) {
				 e.preventDefault();
				 var form = $(this).parents('form');

				 var $valid = $(form).valid();
				 if( $valid) {
						 var formdata = $(form).serialize();
						 console.log(formdata);
						 $.ajax({
								 url: '/hosts',
								 data: formdata,
								 dataType: 'json',
								 type: 'POST',
								 success: function(result) {
										 console.log(result);
										 $.each(result, function(index, el) {
												 // TODO
												 // after redirect to new page, values are lost
												 instProcessing[el.server.id] = times_of_update;
										 });
										 alert("创建成功！");
										 window.location = "/hosts"
								},
								error: function(xhr) {
										var errors = $.parseJSON(xhr.responseText).errors;
										alert("创建失败，请联系管理员！");
								}
						});
				}
		});
		

		
});
