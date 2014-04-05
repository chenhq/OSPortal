jQuery(function($) {

		function add_new_rule(){
				$.ajax({
						url: '/rules/new',
						dataType: 'json',
						type: 'GET',
						success: function(result) {
								$.each(result , function(key, value) {
										console.log(key);
										console.log(value);
										$("#RuleTemplate").tmpl(value).appendTo( "#rules_table");
										// TODO
										// $(".rule-editable").editable();
 										$(".delRule").click(function(){
												console.log($(this).closest('tr'));
												$(this).closest('tr').remove();
										});
								});
						},                                                                                              
				});
		}

		$(".delRule").click(function(){
				console.log($(this).closest('tr'));
				$(this).closest('tr').remove();
    });

		// function del_rule(){
				
		// 		$.ajax({
		// 				url: '/rules/new',
		// 				dataType: 'json',
		// 				type: 'GET',
		// 				success: function(result) {
		// 						$.each(result , function(key, value) {
		// 								console.log(key);
		// 								console.log(value);
		// 								$("#RuleTemplate").tmpl(value).appendTo( "#rules_table");
		// 								$(".rule-editable").editable(); 										
		// 						});
		// 				},                                                                                              
		// 		});
		// }

		function getFirewallConfig() {
				var firewall={};
				$('#form-firewall').find('input').each(function(){
						firewall[$(this).attr('name')]=$(this).val();
				});
				// console.log(firewall);
				var i = 0;
				var rules={};
				$('#rule_data').find('tr').each(function(){
						var rule={};
						$(this).find('a').each(function(){
								rule[$(this).attr('name')]=$(this).text();
						});
						rules[i] = rule;
						i += 1;
						// console.log(rules);
				});
				firewall["rules"] = rules;
				return firewall;    
		}


		$(".submit_firewall").click(function() {
				var firewallconf = getFirewallConfig();
				var action = $(this).attr("action");
				if ( action  == "update" ) {
						$.ajax({
								url: '/securities/' + firewallconf.id,
								dataType: 'json',
								type: 'POST',
								data: { _method:'PUT', firewall: firewallconf },
								success: function(result) {
										alert("命令执行成功！");
								},
						});
				}
				else if ( action  == "create" ) {
						$.ajax({
								url: '/securities',
								dataType: 'json',
								type: 'POST',
								data: firewallconf,
								success: function(result) {
										alert("命令执行成功");
								},
						});
				}
		});

		$("#add_new_rule_btn").click(add_new_rule)
//		$(".rule-editable").editable();

		$('input[name="fwids"]').click(function() { 
				$(".btn-toolbar .btn").removeAttr("disabled");
		});


		function getSelectedIds() {
				ids = [];
				$('input[name="fwids"]:checked').each(function() { 
						ids.push($(this).val());
				})
				console.log(ids);
				return ids;	
		}
		
		$.fn.addOperation = function() {
				return this.bind({
						click: function(e) {
								ids = getSelectedIds();
								console.log(ids);
								action = $(this).attr("action");
								console.log(action);
								if ( action == "edit" ) {
										window.location.replace("/securities/" + ids[0] + "/edit");
								}
								else if (action == "delete") {
										url = "/securities/" + action;
										$.ajax({
												url: url,
												data: { 'ids': ids },
												dataType:'json',
												type: 'POST',
												success: function(result) {
														alert("命令执行成功");
												},
												error: function(xhr) {
														var errors = $.parseJSON(xhr.responseText).errors;
														alert("命令执行失败");
												}
										});
								}
						}	
				})
		}
				
		$(".firewall_op_btn").addOperation();


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
										"mData": "security_group.rules",
										"mRender": function(data, type, full) {
 												return data.length +'&nbsp;&nbsp;条规则&nbsp;&nbsp;' + '<span class="btn-xs btn-primary show-detail" "data-target"="#detail-modal" "data-toggle"="modal"><i class="fa fa-hand-o-right">&nbsp;详情...</i></span>'
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


		$('#detail-modal').on('show.bs.modal', function() {
				console.log('=======');
				detailEditableTable.init();
		});
		
		
		// $('#detail-modal').on('click', 'input[type="submit"]', function(e) {
		// 		e.preventDefault();
		// 		var aData = $(this).parents('form').find('.dataTable').dataTables().fnGetData();
		// 		console.log(aData);
		// });

});
