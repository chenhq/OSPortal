jQuery(function($) {

		$('input[name="ipids"]').click(function() { 
				$(".btn-toolbar .btn").removeAttr("disabled");
		});


		function getSelectedIds() {
				ids = [];
				$('input[name="ipids"]:checked').each(function() { 
						ids.push($(this).val());
				})
				console.log(ids);
				return ids;	
		}
		
		$.fn.addInstanceOperation = function() {
				return this.bind({
						click: function(e) {
								ids = getSelectedIds();
								console.log(ids);
								action = $(this).attr("action");
								console.log(action);
								url = "/floating_ips/" + action;
								$.ajax({
										url: url,
										data: { 'ipids': ids },
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
				})
		}

		$(".btn-toolbar .btn-group .ip_op_btn").addInstanceOperation();
		$(".btn-toolbar .btn-group .ip_op_link").addInstanceOperation();
		

});
