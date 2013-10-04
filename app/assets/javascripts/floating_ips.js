jQuery(function($) {

		$('input[name="ip"]').click(function() { 
				$(".btn-toolbar .btn").removeAttr("disabled");
		});


		function getSelectedInfos() {
				var infos = {};
				var i = 0;
				$('input:checked').each(function() {
						info = {};
						info[$(this).attr("name")] = $(this).data($(this).attr("name"));
						$(this).closest('tr').find('label').each(function() {
								info[$(this).attr('for')] = $(this).data($(this).attr('for'));
								console.log(info);
						});
						infos[i] = info;
						i += 1;
				});
				console.log(infos);
				return infos;	
		}
		
		$.fn.addOperation = function() {
				return this.bind({
						click: function(e) {
								infos = getSelectedInfos();
								console.log(infos);
								action = $(this).attr("action");
								console.log(action);
								url = "/floating_ips/" + action;
								if ( action == "addPublicIP" ) {
										$.ajax({
												url: url,
												data: {ips: 1},
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
								}
								else if ( action == "unbindIPtoServer" ) {
										$.ajax({
												url: url,
												data: infos,
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
								}
								else if ( action == "releasePublicIP" ) {
										$.ajax({
												url: url,
												data: infos,
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
								}
						}
				})
		}
		
		$(".ip_op_btn").addOperation();
		$(".ip_op_link").addOperation();
		

});
