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
		
		//数据盘slider
		$("#datadisk_space_slider").slider();

		$(function() {
				$( "#datadisk_space_slider" ).slider({
						value: 80,
						min: 5,
						max: 1000,
						step: 5,
						slide: function( event, ui ) {
								$( "#datadisk_space" ).val(ui.value);
								$( "#datadisk_space-selected" ).val(ui.value);
						}
				});
				$( "#datadisk_space" ).val($( "#datadisk_space_slider" ).slider( "value" ) );
				$( "#datadisk_space-selected" ).val($( "#datadisk_space_slider" ).slider( "value" ) );
				
		});

		//带宽slider
		$("#bandwidth_slider").slider();

		$(function() {
				$( "#bandwidth_slider" ).slider({
						value:10,
						min: 1,
						max: 1000,
						step: 1,
						slide: function( event, ui ) {
								$( "#bandwidth" ).val(ui.value);
								$( "#bandwidth-selected" ).val(ui.value);
						}
				});
				$( "#bandwidth" ).val($( "#bandwidth_slider" ).slider( "value" ) );
				$( "#bandwidth-selected" ).val($( "#bandwidth_slider" ).slider( "value" ) );
		});


		$("#image_list .btn").click(function() {
				$("#image-selected").val($(this).text().trim());
				$("#image-selected").data("imageid", $(this).data("imageid"));
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
		$("#os_type_list li:eq(1) a").tab('show');

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

		$(".btn-toolbar .btn-group .instance_op_btn").click(function() {
				console.log($(this).html());
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
								alert("命令执行成功！");
						},
						error: function(xhr) {
								var errors = $.parseJSON(xhr.responseText).errors;
								alert("命令执行失败！");
						}
				});
		});

});
