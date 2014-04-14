jQuery(function($) {
		// KeyPairs tableactionable
		$('#keypairs-tableactionable').tableActionable( {
				btnClass: "op-btn",
				ajaxBaseURL: "/key_pairs/",
				datatable: 	{
						"sAjaxSource": "/key_pairs.json",
						"bAutoWidth": false,
						"aoColumns": [
								{
										"sClass": "center",
										"sWidth": "10%",
										"bSearchable": false,
										"bSortable": false,
										"mData": "key_pair.name",
										"mRender": function(data, type, full) {
												return '<div class="square-yellow"> <div class="checkbox"><input type="checkbox" name="id", value="'+ data + '"></div> </div>'
										}
								},
								{ 
										"sClass": "center",
										"sWidth": "10%",
										"mData": "key_pair.name",
										"mRender": function(data, type, full) {
												return '<a class="name" href="#">' + data  + '</a>'
										}
								},
								{ 
										"sClass": "center",
										"sWidth": "15%",
										"mData": "key_pair.fingerprint",
										"mRender": function(data, type, full) {
												return data
										}
								}
						],

				},
				modalFunctions : 	{
						"delete-keypairs-modal": function(selected) {
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

		// modal init when show
		$('#create-keypair-modal').on('show.bs.modal', function() {
				$(this).find('.after-created').addClass('hidden');
				$(this).find('.before-created').removeClass('hidden');
		});

		// create KeyPair
		$('#create-keypair-modal form').submit(createKeyPair);

		// download private key
		$('#create-keypair-modal').on('click', 'button[name="download"]', function(e) {
				e.preventDefault();
				var name = $(this).parents('.modal-content').find('.modal-body input[name="name"]').val();
				var private_key = $(this).parents('.modal-content').find('.modal-body textarea[name="private_key"]').val();

				var pom = document.createElement('a');
				pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(private_key));
				pom.setAttribute('download', name+'.key');
				pom.click();

		});

		// create KeyPair and display
		function createKeyPair(e) {
				if (!$(this).valid()) return false;
				e.preventDefault();
				var form = $(this);
				var data = $(this).serialize();
				$.ajax({
						url: '/key_pairs',
						beforeSend: function(xhr) {
								xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
						},
						data: data,
						dataType: 'json',
						type: 'POST',
						success: function(result) {
								form.find('#key-info input[name="fingerprint"]').val(result.keypair.fingerprint);
								form.find('#key-info textarea[name="private_key"]').val(result.keypair.private_key);
								
								alert("创建密钥成功! \n\n\t请下载并妥善保存私钥信息！");
								form.find('.before-created').addClass('hidden');
								form.find('.after-created').removeClass('hidden');

								// table reload
								$('#keypair-table').dataTable().fnReloadAjax();

						},
						error: function(xhr) {
								var errors = $.parseJSON(xhr.responseText).errors;
								alert("命令执行失败！\n\n\t" + errors);
						}
				});
		}


		// validations
		$('#create-keypair').validate({
				rules: {
						name: {
								required: true,
								rangelength: [3, 30],
								alphanumeric: true
						}
				}
		});

});
