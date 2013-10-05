jQuery(function($) {

		$('input[name="id"]').click(function() { 
				$(".btn-toolbar .btn").removeAttr("disabled");
		});

		function getSelectedVolumeIds() {
				ids = [];
				$('input[name="id"]:checked').each(function() { 
						ids.push($(this).val());
				})
				console.log(ids);
				return ids;	
		}
		
		$.fn.addVolumeOperation = function() {
				return this.bind({
						click: function(e) {
								var vids = getSelectedVolumeIds();
								console.log(vids);
								var action = $(this).attr("action");
								console.log(action);
								var url = "/volumes/" + action;
								console.log("vids:" + vids);
								if ( action == "delete" ) {
										$.ajax({
												url: url,
												dataType: 'json',
												type: 'POST',
												data: {id: vids},
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
		};

		$(".volume_op_btn").addVolumeOperation();

});
