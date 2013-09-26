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


		$("#os_list .btn").click(function() {
				$("#image-selected").val($(this).text());
		}); 
		$("#cpu_list .btn").click(function() {
				$("#cpu-selected").val($(this).text());
		}); 
		$("#mem_list .btn").click(function() {
				$("#mem-selected").val($(this).text());
		}); 


		$("#mem-selected").val($("#mem_list .active").text());
		$("#cpu-selected").val($("#cpu_list .active").text());
		$("#OSdisk-selected").val("30");
		$("#image-selected").val($("#image_list .active .active").text());
		
		function hostcreate(e) {
				e.preventDefault();
				
				var cpu             = $('#cpu-selected').val();
				var mem             = $('#mem-selected').val();
				var OSdisk          = $('#OSdisk-selected').val();
				var datadisk_space  = $('#datadisk_space-selected').val();
				var image           = $('#image-selected').val();
				var bandwidth       = $('#bandwith-selected').val();
				var time            = $('#time-selected').val();
				var count           = $('#count-selected').val();

				$.ajax({
						url: '/hosts',
						data: { 'cup': cpu, 'mem': mem, 'OSdisk': OSdisk, 'datadisk_space': datadisk_space },
						dataType: 'script',
						type: 'POST',
						success: function ( result) {
								alert("okkkkkkkkkkkk....")
								}
				});
		}

		$('#step2_btn_commit').click(hostcreate);

		$(".host_popovers").popover();

});
