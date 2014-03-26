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
										"mData": "security_group.name",
										"mRender": function(data, type, full) {
												var css_class, status, icon;
												switch(data.toLowerCase()) {
												case 'active':
														css_class = "btn-success";
														status = "活动";
														icon = "fa-check";
														break;
												case 'saving': 
														css_class = "btn-info";
														status = "创建...";
														icon = "fa-cog fa-spin";
														break;
												case 'error': 
														css_class = "btn-error";
														status = "错误";
														icon = "fa-frown-o";
														break;
												case 'deleted': 
														css_class = "btn-error";
														status = "已删除";
														icon = "fa-frown-o";
														break;
												case 'unknown': 
														css_class = "btn-error";
														status = "异常";
														icon = "fa-frown-o";
														break;
												default: 
														css_class = "default";
														status = "未知";
														icon = "";
												}
												
 												return '<span class="btn-sm btn-block ' + css_class + '"><i class="fa ' + icon + '"></i>&nbsp' + status + '</span>'
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

				}
		});


		
});
