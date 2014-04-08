(function ($) {

    $.fn.otherize = function (option_text, texts_placeholder_text) {
        oSel = $(this);
        option_id = oSel.attr('id') + '_other';
        textbox_id = option_id + "_tb";

        // this.append("<option value='' id='" + option_id + "' class='otherize' >" + option_text + "</option>");
        // this.after("<input type='text' id='" + textbox_id + "' style='display:  placeholder='" + texts_placeholder_text + "'/>");
        // this.change(

				// 		function () {
				// 				oTbox = oSel.parent().children('#' + textbox_id);
				// 				oSel.children(':selected').hasClass('otherize') ? oTbox.show() : oTbox.hide();
				// 		});

        // $("#" + textbox_id).change(

				// 		function () {
				// 				$("#" + option_id).val($("#" + textbox_id).val());
				// 		});


        // this.append("<option value='' id='" + option_id + "' class='otherize' >" + option_text + "</option>");
        // this.after("<input type='text' id='" + textbox_id + "' style='display:  placeholder='" + texts_placeholder_text + "'/>");
        this.change(

						function () {
								oTbox = $('#' + textbox_id);
								oSel.children(':selected').hasClass('otherize') ? oTbox.show() : oTbox.hide();
						});

        $("#" + textbox_id).change(

						function () {
								$("#" + option_id).val($("#" + textbox_id).val());
						});


    };
}(jQuery));
