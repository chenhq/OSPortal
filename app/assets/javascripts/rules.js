jQuery(function($) {
		ajaxUrl = window.location.pathname + '.json?content=only-rules'
		console.log(ajaxUrl);
		$('#rules-tableactionable').tableActionable( {
				btnClass:  "rules-op-btn",
				ajaxBaseURL: ajaxUrl,
				datatable: 	{
						"sAjaxSource": ajaxUrl,
						"aLengthMenu": [
								[5, 15, 20, -1],
								[5, 15, 20, "All"]
						],
						"iDisplayLength": 5,
						"aoColumns": [
								{
										"sClass": "center",
										"mData": "rule.id",
										"bSearchable": false,
										"bSortable": false,
										"mRender": function(data, type, full) {
												return '<div class="square-yellow"> <div class="checkbox"><input type="checkbox" name="id", value="'+ data + '"></div> </div>'} 
								},	
								{
										"sClass": "center",
										"mData": "rule.id",
								},
								{
										"sClass": "center",
										"mData": "rule.ip_protocol",
								},
								{ 
										"sClass": "center",
										"mData": "rule.from_port"
								},
								{ 
										"sClass": "center",
										"mData": "rule.to_port"
								},
								{ 
										"sClass": "center",
										"mData": "rule.cidr",
								}
						]
				},

				modalFunctions : 	{
						"delete-rule-modal": function(selected) {
								$(this).find('.modal-checkboxes').html($('#tmpl-modal-checkbox').tmpl(selected));
								
								icheck = $(this).find('input[type="checkbox"]');

								icheck.iCheck({
										checkboxClass: 'icheckbox_square-yellow',
										radioClass: 'iradio_square-yellow',
										increaseArea: '20%' // optional
								});
								icheck.iCheck('check');
						}
				}
		});


		$('#port-option input').on('ifChecked', function(event){
				$('#port-option .form-group').hide();
				$($(this).attr("option")+ ' .form-group').show();
		});
		
		$('#port-option input[option="#single-port"]').iCheck('check');

		// $('#select-port').otherize("其他", '');

		// $('#detail-modal').on('show.bs.modal', function() {

		// 		detailEditableTable.init();
		// });
		
		
		// $('#detail-modal').on('click', 'input[type="submit"]', function(e) {
		// 		e.preventDefault();
		// 		var aData = $(this).parents('form').find('.dataTable').dataTables().fnGetData();
		// 		console.log(aData);
		// });

		// rulesTable = $('#rules-table').dataTable({
		// 		"aLengthMenu": [
		// 				[5, 15, 20, -1],
		// 				[5, 15, 20, "All"] // change per page values here
		// 		],
		// 		// set the initial value
		// 		"iDisplayLength": 5,
		// 		"aoColumns": [
		// 				{
		// 						"sClass": "center",
		// 						"mData": "rule.ip_protocol",
		// 				},
		// 				{ 
		// 						"sClass": "center",
		// 						"mData": "rule.from_port",
		// 				},
		// 				{ 
		// 						"sClass": "center",
		// 						"mData": "rule.to_port",
		// 				},	
		// 				{ 
		// 						"sClass": "center",
		// 						"mData": "rule.cidr",
		// 				},	
		// 				{ 
		// 						"sClass": "center",
		// 						"mData": "rule.id",
		// 						"mRender": function(data, type, full) {
		// 								return '<a class="delete btn btn-sm btn-block btn-primary" data-id="' + data +'" href="javascript:;">编辑</a>'
		// 						}
		// 				},
		// 				{ 
		// 						"sClass": "center",
		// 						"mData": "rule.id",
		// 						"mRender": function(data, type, full) {
		// 								return '<a class="delete btn btn-sm btn-block btn-primary" data-id="' + data +'" href="javascript:;">删除</a>'
		// 						}
		// 				},
		// 		]
		// });
		
		$('#select-port').select2({
        allowClear: true,
				createSearchChoice: function(term, data) {
						if ($(data).filter(function() {return this.text.localeCompare(term)===0; }).length===0) {
								return {id:term, text:term};}
				},
				data: [ 
						{id: 22, text: 'SSH'},
						{id: 23, text: 'Telnet'},
						{id: 21, text: 'FTP'},
						{id: 80, text: 'HTTP'},
						{id: 53, text: 'DNS'}
				]
		});
		
		$(':input').inputmask();


});
