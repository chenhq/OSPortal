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


		var imgTable = $('#img-table').dataTable( {
				"sAjaxSource": "/images.json",
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
										return '<div class="square-yellow"> <div class="checkbox"><input type="checkbox" name="volid", value="'+ data + '"></div> </div>'
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
										case 'active':
												css_class = "btn-success";
												status = "活动";
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
								"mData": "volume.create_at",
								"mRender": function(data, type, full) {
										return  data
								}
						}
				],
				"sAjaxDataProp": "",
				"fnDrawCallback": function( oSettings ) {
						$('#inst-table input').iCheck({
								checkboxClass: 'icheckbox_square-yellow',
								radioClass: 'iradio_square-yellow',
								increaseArea: '20%' // optional
						});
						$('#inst-table input[name="id"]').on('ifChecked', function(event){
								var id = $(this).val();
								index = jQuery.inArray(id, volSelected);
								if ( index === -1 ) {
										volSelected.push(id);
								}
								console.log(volSelected);
								if ( volSelected.length > 0 ) {
										$("#inst-toolbar").find('.vol-op-btn.disabled').removeClass("disabled");
								}
						});

						$('#vol-table input[name="id"]').on('ifUnchecked', function(event){
								var id = $(this).val();
								index = jQuery.inArray(id, volSelected);
								if ( index !== -1 ) {
										volSelected.splice(index, 1 );
								}
								console.log(volSelected);
								if ( volSelected.length < 1 ) {
										$("#vol-toolbar").find('.vol-op-btn').addClass("disabled");
								};
						});

						for ( var i = 0; i < volSelected.length; i = i + 1 ) {
								var checkbox_selector = '#vol-table input[value=' + volSelected[i] + ']';
								console.log($(checkbox_selector));
								$(checkbox_selector).iCheck('check');
						}
						// re init instSelected


				}
		});


});
