jQuery(function($) {

		$('input[name="imageids"]').click(function() { 
				$(".btn-toolbar .btn").removeAttr("disabled");
		});

		function getSelectedImageIds() {
				ids = [];
				$('input[name="imageids"]:checked').each(function() { 
						ids.push($(this).val());
				})
				console.log(ids);
				return ids;	
		}
		
		$.fn.addImageOperation = function() {
				return this.bind({
						click: function(e) {
								ids = getSelectedImageIds();
								console.log(ids);
								action = $(this).attr("action");
								console.log(action);
								url = "/images/" + action;
								if ( action == "delete" ) {
										$.ajax({
												url: url,
												data: { 'imageids': ids },
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

		$(".btn-toolbar .btn-group .image_op_btn").addImageOperation();
});
