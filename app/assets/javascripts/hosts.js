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

		
		$(".btn-toolbar .btn-group .instance_op_btn").addInstanceOperation();
		$(".btn-toolbar .btn-group .instance_op_link").addInstanceOperation();
		
		$.fn.addSelectable = function(options) {
				var defaults = {
						callback: function() {}
				};
								
				var options = $.extend(defaults, options);

				return this.bind('click', function() {
						$(this).parent().find('.selected').removeClass('selected')
						$(this).addClass('selected');
						console.log(this);
						options.callback(this);
				});
		};
		
		var showInstanceOptions = {

				public_images: null,

				init : function() {
						$('#create-instance-modal').on('shown', showInstanceOptions.showAll);
						
						// images
						$('.ostypes').delegate('a[data-owner="public"]', 'click', showInstanceOptions.showPublicImages);
						$('.ostypes').delegate('a[data-owner="private"]', 'click', showInstanceOptions.showPrivateImages);

				},

				showAll : function() {
						showInstanceOptions.showOSTypes();
						showInstanceOptions.showFlavors();
				},
			
				showOSTypes: function() {
						$('.ostypes a[data-owner!="private"]').remove();
						ostypes = $.ajax('/os_types.json',{
								cache: true,
								async: false,
								complete: function() {
										console.log('complete get os types');
								},

								success: function(ostypes) {
										$("#tmpl-ostypes").tmpl(ostypes).appendTo('.ostypes');
								},
								error: function() {
										alert('can not get os types');
								}
						})
						$('.ostypes .ostype').addSelectable();						
						$('.ostypes .ostype:eq(1)').trigger('click');
				},

				showPublicImages: function(e) {
						console.log('enter show public images');
						e.preventDefault();
						console.log($(this).text());
						var ostypeid = $(this).data('id');
						console.log('id:');
						console.log(ostypeid);
						$('.images').empty();
						if (showInstanceOptions.public_images==null) {
								$.ajax('/operating_systems.json',{
										cache: true,
										async: false,
										complete: function() {
												console.log('complete get images');
										},

										success: function(images) {
												showInstanceOptions.public_images = images;
										},

										error: function() {
												alert('can not get images');
										}
										
								});
						};
						var filtered_images = [];
						$.each(showInstanceOptions.public_images, function(index, image) {
								if (image.os_type_id==ostypeid) {
										filtered_images.push(image);
								}
						});
						$('#tmpl-public-images').tmpl(filtered_images).appendTo('.images');
						$('.images .image').addSelectable();
						$('.images .image:first').click();
				},

				showPrivateImages: function() {
						$('.images').empty();
						$.ajax('/images.json',{
								cache: false,
								async: false,
								complete: function() {
								},

								success: function(images) {
										$('#tmpl-private-images').tmpl(images).appendTo('.images');
								},
								error: function() {
										alert('can not get images');
								}
						});
						
						$('.images .image').addSelectable();
						$('#images .image:first').click();
				},

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
										$('.memories .memory').addSelectable();

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
														
														$('.memories [class=memory]').last().addClass('selected');
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

		$('#create-instance-form').easyWizard({
				stepsText: '{t} {n}',
				prevButton: '上一步',
				nextButton: '下一步',
				submitButtonText: '创建主机',
				buttonsClass: 'btn',
				submitButtonClass: 'btn btn-primary'
		});
});
