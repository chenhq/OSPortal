var detailEditableTable = function () {

    return {

        //main function to initiate the module
        init: function () {
            function restoreRow(rulesTable, nRow) {
                var aData = rulesTable.fnGetData(nRow);
                var jqTds = $('>td', nRow);

                for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
                    rulesTable.fnUpdate(aData[i], nRow, i, false);
                }

                rulesTable.fnDraw();
            }

            function editRow(rulesTable, nRow) {
                var aData = rulesTable.fnGetData(nRow);
                var jqTds = $('>td', nRow);
                jqTds[0].innerHTML = '<input type="text" class="form-control small" value="' + aData[0] + '">';
                jqTds[1].innerHTML = '<input type="text" class="form-control small" value="' + aData[1] + '">';
                jqTds[2].innerHTML = '<input type="text" class="form-control small" value="' + aData[2] + '">';
                jqTds[3].innerHTML = '<input type="text" class="form-control small" value="' + aData[3] + '">';
                jqTds[4].innerHTML = '<input type="text" class="form-control small" value="' + aData[4] + '">';
                jqTds[5].innerHTML = '<a class="edit btn btn-sm btn-block btn-primary" href="">保存</a>';
                jqTds[6].innerHTML = '<a class="cancel btn btn-sm btn-block btn-primary" href="">取消</a>';
            }

            function editNewRow(rulesTable, nRow) {
                var aData = rulesTable.fnGetData(nRow);
                var jqTds = $('>td', nRow);
                jqTds[0].innerHTML = '<input type="text" class="form-control small" value="' + aData[0] + '">';
                jqTds[1].innerHTML = '<input type="text" class="form-control small" value="' + aData[1] + '">';
                jqTds[2].innerHTML = '<input type="text" class="form-control small" value="' + aData[2] + '">';
                jqTds[3].innerHTML = '<input type="text" class="form-control small" value="' + aData[3] + '">';
                jqTds[4].innerHTML = '<input type="text" class="form-control small" value="' + aData[4] + '">';
                jqTds[5].innerHTML = '<a class="edit btn btn-sm btn-block btn-primary" href="">保存</a>';
                jqTds[6].innerHTML = '<a class="cancel btn btn-sm btn-block btn-primary" data-mode="new" href="">取消</a>';
            }

            function saveRow(rulesTable, nRow) {
                var jqInputs = $('input', nRow);
                rulesTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
                rulesTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
                rulesTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
                rulesTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
								rulesTable.fnUpdate(jqInputs[4].value, nRow, 4, false);
                rulesTable.fnUpdate('<a class="edit btn btn-sm btn-block btn-primary" href="">编辑</a>', nRow, 5, false);
                rulesTable.fnUpdate('<a class="delete btn btn-sm btn-block btn-primary" href="">删除</a>', nRow, 6, false);
                rulesTable.fnDraw();
            }

            function cancelEditRow(rulesTable, nRow) {
                var jqInputs = $('input', nRow);
                rulesTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
                rulesTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
                rulesTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
                rulesTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
                rulesTable.fnUpdate(jqInputs[4].value, nRow, 4, false);
                rulesTable.fnUpdate('<a class="edit btn btn-sm btn-block btn-primary" href="">编辑</a>', nRow, 5, false);
                rulesTable.fnDraw();
            }
						console.log('-----------------');
            var rulesTable = $('#detail-table').dataTable({
                "aLengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"] // change per page values here
                ],
                // set the initial value
                "iDisplayLength": 5,
								"aoColumns": [
										{
												"sClass": "center",
												"mData": "rule.ip_protocol",
										},
										{ 
												"sClass": "center",
												"mData": "rule.from_port",
										},
										{ 
												"sClass": "center",
												"mData": "rule.to_port",
										},	
										{ 
												"sClass": "center",
												"mData": "rule.cidr",
										},	
										{ 
												"sClass": "center",
												"mData": "rule.id",
												"mRender": function(data, type, full) {
														return '<a class="delete btn btn-sm btn-block btn-primary" data-id="' + data +'" href="javascript:;">编辑</a>'
												}
										},
										{ 
												"sClass": "center",
												"mData": "rule.id",
												"mRender": function(data, type, full) {
														return '<a class="delete btn btn-sm btn-block btn-primary" data-id="' + data +'" href="javascript:;">删除</a>'
												}
										},
								]
            });

            // jQuery('#editable-sample_wrapper .dataTables_filter input').addClass("form-control medium"); // modify table search input
            // jQuery('#editable-sample_wrapper .dataTables_length select').addClass("form-control xsmall"); // modify table per page dropdown
						// rulesTable.fnAddData(aoRules[0]);

            var nEditing = null;

            $('#detail-item-new').click(function (e) {
                e.preventDefault();
                var aiNew = rulesTable.fnAddData(['', '', '', '',
                        '<a class="edit btn btn-sm btn-block btn-primary" href="">编辑</a>',
												'<a class="cancel btn btn-sm btn-block btn-primary" data-mode="new" href="">取消</a>'
                ]);
                var nRow = rulesTable.fnGetNodes(aiNew[0]);
                editNewRow(rulesTable, nRow);
                nEditing = nRow;
            });

            $('#detail-table').on('click','a.delete', function (e) {
                e.preventDefault();

                if (confirm("Are you sure to delete this row ?") == false) {
                    return;
                }

                var nRow = $(this).parents('tr')[0];
                rulesTable.fnDeleteRow(nRow);
                alert("Deleted! Do not forget to do some ajax to sync with backend :)");
            });

            $('#detail-table').on('click', 'a.cancel', function (e) {
                e.preventDefault();
                if ($(this).data("mode") == "new") {
										console.log('new item');
                    var nRow = $(this).parents('tr')[0];
										console.log(nRow);
                    rulesTable.fnDeleteRow(nRow);
                } else {
                    restoreRow(rulesTable, nEditing);
                    nEditing = null;
                }
            });

            $('#detail-table').on('click', 'a.edit', function (e) {
                e.preventDefault();

                /* Get the row as a parent of the link that was clicked on */
                var nRow = $(this).parents('tr')[0];

                if (nEditing !== null && nEditing != nRow) {
                    /* Currently editing - but not this row - restore the old before continuing to edit mode */
                    restoreRow(rulesTable, nEditing);
                    editRow(rulesTable, nRow);
                    nEditing = nRow;
                } else if (nEditing == nRow && this.innerHTML == "保存") {
                    /* Editing this row and want to save it */
                    saveRow(rulesTable, nEditing);
                    nEditing = null;
                    alert("Updated! Do not forget to do some ajax to sync with backend :)");
                } else {
                    /* No edit in progress - let's start one */
                    editRow(rulesTable, nRow);
                    nEditing = nRow;
                }
            });
        }

    };

}();
