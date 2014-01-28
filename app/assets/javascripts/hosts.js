jQuery(function($) {
		
		// 隐藏第二步骤信息
		$("#host_create_step2").hide();
		$("#step2_btns").hide();

		// 下一步
		$("#step1_btn").click(function() {
				$("#host_create_step1").hide();
				$("#step1_btns").hide();
				$("#host_create_step2").show();
				$("#step2_btns").show();
				
		});

		// 上一步
		$("#step2_btn_pre").click(function() {
				$("#host_create_step2").hide();
				$("#step2_btns").hide();
				$("#host_create_step1").show();
				$("#step1_btns").show();
		});
		
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

		//os select
		$("#image_list .btn").click(function() {
				$("#image-selected").val($(this).text().trim());
				$("#image-selected").data("imageid", $(this).data("imageid"));
				osfamily = $(this).data("osfamily").trim().toLowerCase();
				ostype = $(this).data("ostype").trim().toLowerCase();
				
				if (  osfamily == "linux" ) {
						if ( ostype == "ubuntu" ) {
								$("#username").val("ubuntu");
						}
						else {
								$("#username").val("root");
						}
				}
				else if (osfamily == "windows" ){
						$("#username").val("administrator");
				}
				else {
						$("#username").val("默认用户");
				}

		}); 
		$("#cpu_list .btn").click(function() {
				$("#cpu-selected").val($(this).text().trim());
				$("#cpu-selected").data("value", $(this).data("value"));
		}); 
		$("#mem_list .btn").click(function() {
				$("#mem-selected").val($(this).text().trim());
				$("#mem-selected").data("value", $(this).data("value"));
		}); 


		$("#cpu-selected").val($("#cpu_list .active").text());
		$("#cpu-selected").data("value", $("#cpu_list .active").data("value"));
		$("#mem-selected").val($("#mem_list .active").text());
		$("#mem-selected").data("value", $("#mem_list .active").data("value"));

		$("#OSdisk-selected").val("30");
		$("#image-selected").val($("#image_list .active .active").text());
		
		function hostcreate(e) {
				e.preventDefault();
				
				var imageid         = $('#image-selected').data("imageid");
				var cpu             = $('#cpu-selected').data("value");
				var mem             = $('#mem-selected').data("value")
				var OSdisk          = $('#OSdisk-selected').val();
				var datadisk_space  = $('#datadisk_space-selected').val();
				var bandwidth       = $('#bandwith-selected').val();
				var hostname        = $('#hostname').val();
				var username        = $('#username').val();
				var password        = $('#password').val();
				$.ajax({
						url: '/hosts',
						data: { 'imageid': imageid, 'cpu': cpu, 'mem': mem, 'OSdisk': OSdisk, 'datadisk_space': datadisk_space, 'bandwidth': bandwidth , 'hostname': hostname, 'password': password},
						dataType: 'json',
						type: 'POST',
						success: function(result) {
								alert("创建成功！");
								window.location = "/hosts"
						},
						error: function(xhr) {
								var errors = $.parseJSON(xhr.responseText).errors;
								alert("创建失败，请联系管理员！");
						}
				});
		}

		$('#step2_btn_commit').click(hostcreate);

		$(".host_popovers").popover();
		
		// 镜像选择，默认选择地一个tab页
		$("#os_type_list li:eq(3) a").tab('show');

		$('input[name="serverids"]').click(function() { 
				$(".btn-toolbar .btn").removeAttr("disabled");
				inst_name = $(this).attr("hostname");
				inst_id = $(this).val();
				$('input[name="image_create_host"]').val(inst_name);
				$('input[name="img-create-instance-id"]').val(inst_id);
		});

		function getSelectedServerIds() {
				ids = [];
				$('input[name="serverids"]:checked').each(function() { 
						ids.push($(this).val());
				})
				console.log(ids);
				return ids;	
		}

		$.fn.addInstanceOperation = function() {
				return this.bind({
						click: function(e) {
								ids = getSelectedServerIds();
								console.log(ids);
								action = $(this).attr("action");
								console.log(action);
								url = "/hosts/" + action;
								$.ajax({
										url: url,
										data: { 'serverids': ids },
										dataType: 'json',
										type: 'POST',
										success: function(result) {
												if ( action == "emergency_login" ) {
														console.log("emergency_login");
														window.open(result.vnc_console, '_blank');
												}
												else { 
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
		}

		$.fn.addSelectd = function() {
				return this.bind('click', function() {
						$(this).addClass('selected');})
		}


		$(".btn-toolbar .btn-group .instance_op_btn").addInstanceOperation();
		$(".btn-toolbar .btn-group .instance_op_link").addInstanceOperation();
		
		
		var showImageOptions = {
				public_images: null,

				init : function() {
						$('#create-instance-modal').on('shown', showImageOptions.showAll);
						$('#ostypes').delegate('a[data-owner="public"]', 'click', showImageOptions.showPublicImages);
						$('#ostypes').delegate('a[data-owner="private"]', 'click', showImageOptions.showPrivateImages);
						$('#images').delegate('.image', 'click', function() { 
								$(this).parent().find('.selected').removeClass('selected')
								$(this).addClass('selected');
						});
						$('#ostypes').delegate('.ostype', 'click', function() { 
								$(this).parent().find('.selected').removeClass('selected')
								$(this).addClass('selected');
						});

						$('.custom-instance-flavor .types').delegate('.inner', 'click', function() {
								$(this).parent().siblings().find('span').hide();
								$(this).find('span').show();
						});

						$('
				},

				showAll : function() {
						showImageOptions.showOSTypes();
						$('#ostypes a:eq(1)').trigger('click');
						// showImageOptions.showPublicImages();
				},
			
				showOSTypes: function() {
						$('#ostypes a[data-owner!="private"]').remove();
						ostypes = $.ajax('/os_types.json',{
								cache: true,
								async: false,
								complete: function() {
										console.log('complete get os types');
								},

								success: function(ostypes) {
										$("#tmpl-ostypes").tmpl(ostypes).appendTo('#ostypes');
								},
								error: function() {
										alert('can not get os types');
								}
						})
				},

				showPublicImages: function(e) {
						console.log('enter show public images');
						e.preventDefault();
						console.log($(this).text());
						var ostypeid = $(this).data('typeid');
						console.log('typeid:');
						console.log(ostypeid);
						$('#images').empty();
						if (showImageOptions.public_images==null) {
								$.ajax('/operating_systems.json',{
										cache: true,
										async: false,
										complete: function() {
												console.log('complete get images');
										},

										success: function(images) {
												showImageOptions.public_images = images;
										},

										error: function() {
												alert('can not get images');
										}
										
								});
						};
						var filtered_images = [];
						$.each(showImageOptions.public_images, function(index, image) {
								if (image.os_type_id==ostypeid) {
										filtered_images.push(image);
								}
						});
						$('#tmpl-public-images').tmpl(filtered_images).appendTo('#images');								
						$('#images .image:first').click();
				},

				selectItem: function() {
						
				},

				showPrivateImages: function() {
						$('#images').empty();
						$.ajax('/images.json',{
								cache: false,
								async: false,
								complete: function() {
								},

								success: function(images) {
										$('#tmpl-private-images').tmpl(images).appendTo('#images');
								},
								error: function() {
										alert('can not get images');
								}
						});
						$('#images .image:first').click();
				}

		}
		
		showImageOptions.init();

		$('#create-instance-steps').easyWizard({
				stepsText: '{t} {n}',
				prevButton: '上一步',
				nextButton: '下一步',
				submitButtonText: '创建主机',
				buttonsClass: 'btn',
				submitButtonClass: 'btn btn-primary'
		});
});
