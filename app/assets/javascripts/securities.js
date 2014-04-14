jQuery(function($) {
		$('#sec-tableactionable').tableActionable( {
				btnClass: "sec_op_btn",
				ajaxBaseURL: "/securities/",
				datatable: 	{
						"sAjaxSource": "/securities.json",
						"bAutoWidth": false,
						// "bProcessing" : true,
						"aoColumns": [
								{
										"sClass": "center",
										"sWidth": "10%",
										"bSearchable": false,
										"bSortable": false,
										"mData": "security_group.id",
										"mRender": function(data, type, full) {
												return '<div class="square-yellow"> <div class="checkbox"><input type="checkbox" name="id", value="'+ data + '"></div> </div>'
										}
								},
								{ 
										"sClass": "center",
										"sWidth": "10%",
										"mData": "security_group.name",
										"mRender": function(data, type, full) {
												return '<a class="name" href="#">' + data  + '</a>'
										}
								},
								{ 
										"sClass": "center",
										"sWidth": "10%",
										"mData": "security_group",
										"mRender": function(data, type, full) {
 												return data.rules.length +'&nbsp;&nbsp;条规则&nbsp;&nbsp;' + '<a class="btn-xs btn-primary" href="/securities/' + data.id + '"<i class="fa fa-hand-o-right">&nbsp;详情...</i></a>'
										}
								},
								{ 
										"sClass": "center",
										"sWidth": "15%",
										"mData": "security_group.description",
										"mRender": function(data, type, full) {
												return data
										}
								}
						],

				},
				modalFunctions : 	{
						"delete-sec-modal": function(selected) {
								$(this).find('.modal-checkboxes').html($('#tmpl-modal-checkbox').tmpl(selected));
								
								icheck = $(this).find('input[type="checkbox"]');

								icheck.iCheck({
										checkboxClass: 'icheckbox_square-yellow',
										radioClass: 'iradio_square-yellow',
										increaseArea: '20%' // optional
								});
								icheck.iCheck('check');
						},
						"edit-sec-modal": function(selected) {
								console.log('edit-sec-modal....');
								console.log(selected);
								var sg = selected[0].security_group;
								var sg_edit_path = '/securities/' + sg.id;
								$(this).find('form').attr('action', sg_edit_path);
							
								$(this).find('input[name="security_group[name]"]').val(sg.name);
								$(this).find('textarea[name="security_group[description]"]').val(sg.description);
						}
				}

		});


		// validations
		$('#create-sec').validate({
				rules: {
						name: {
								required: true,
								alphanumeric: true,
								rangelength: [3, 30]
						},
						description: {
								maxlength: 255
						}
				}
		})

		$('#delete-securities').submit(deleteSecurityGroups);

		function deleteSecurityGroups (e) {
				e.preventDefault();
				var data = $(this).serialize();
				console.log(data);
				$.ajax({
						url: '/securities/delete',
						beforeSend: function(xhr) {
								xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
						},
						data: data,
						dataType: 'json',
						type: 'POST',
						success: function(result) {
								// table reload
								$('#sec-table').dataTable().fnReloadAjax();
						},
						error: function(xhr) {
								var errors = $.parseJSON(xhr.responseText).errors;
								alert("命令执行失败！\n\n\t" + errors);
						}
				});
		}


});
