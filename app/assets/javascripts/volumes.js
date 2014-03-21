jQuery(function($) {
		$('#vol-tableactionable').tableActionable( {
				btnClass: "volume_op_btn",
				ajaxBaseURL: "/volumes/",
				datatable: {
						"sAjaxSource": "/volumes.json",
						"bAutoWidth": false,
						// "bProcessing" : true,
						"aoColumns": [
								{
										"sClass": "center",
										"sWidth": "10%",
										"bSearchable": false,
										"bSortable": false,
										"mData": "volume.id",
										"mRender": function(data, type, full) {
												return '<div class="square-yellow"> <div class="checkbox"><input type="checkbox" name="id", value="'+ data + '"></div> </div>'
										}
								},
								{ 
										"sClass": "center",
										"sWidth": "10%",
										"mData": "volume.display_name",
										"mRender": function(data, type, full) {
												return '<a href="#">' + data  + '</a>'
										}
								},
								{ 
										"sClass": "center",
										"sWidth": "10%",
										"mData": "volume.status",
										"mRender": function(data, type, full) {
												var css_class, status, icon;
												switch(data.toLowerCase()) {
												case 'available':
														css_class = "btn-success";
														status = "可用";
														icon = "fa-check";
														break;
												case 'build': 
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
												case 'deleting':
														css_class = "btn-info"
														status = "删除中..."
														icon = "fa-cog fa-spin";
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
										"mData": "volume.size",
										"mRender": function(data, type, full) {
												return data + 'G'
										}
								},
								{ 
										"sClass": "center",
										"mWidth": "15%",					
										"mData": "volume.id",
										"mRender": function(data, type, full) {
												return data
										}
								},
								{ 
										"sClass": "center",
										"mWidth": "15%",					
										"mData": "volume.id",
										"mRender": function(data, type, full) {
												return data
										}
								},
								{ 
										"mWidth": "20%",
										"mData": "volume.display_description",
								},
								{ 
										"mWidth": "20%",
										"mData": "volume.created_at",
										"mRender": function(data, type, full) {
												return  data
										}
								}
						],
				}
		});

});
