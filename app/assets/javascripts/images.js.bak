jQuery(function($) {

		$('#img-tableactionable').tableActionable( {
				btnClass: "image_op_btn",
				ajaxBaseURL: "/images/",
				datatable: 	{
						"sAjaxSource": "/images.json",
						"bAutoWidth": false,
						// "bProcessing" : true,
						"aoColumns": [
								{
										"sClass": "center",
										"sWidth": "10%",
										"bSearchable": false,
										"bSortable": false,
										"mData": "image.id",
										"mRender": function(data, type, full) {
												return '<div class="square-yellow"> <div class="checkbox"><input type="checkbox" name="id", value="'+ data + '"></div> </div>'
										}
								},
								{ 
										"sClass": "center",
										"sWidth": "10%",
										"mData": "image.name",
										"mRender": function(data, type, full) {
												return '<a href="#">' + data  + '</a>'
										}
								},
								{ 
										"sClass": "center",
										"sWidth": "10%",
										"mData": "image.status",
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
										"mData": "image.progress",
										"mRender": function(data, type, full) {
												return data
										}
								},
								{ 
										"sClass": "center",
										"mWidth": "15%",					
										"mData": "image.metadata",
										"mRender": function(data, type, full) {
												return data
										}
								},
								{ 
										"sClass": "center",
										"mWidth": "15%",					
										"mData": "image.server_id",
										"mRender": function(data, type, full) {
												return data
										}
								},
								{ 
										"mWidth": "20%",
										"mData": "image.created_at",
								}
						],

				}
		});

});
