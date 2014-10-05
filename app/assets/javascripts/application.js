// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require lib/jquery
//= require jquery_ujs
//= require js/bootstrap
//= require accordion-menu/jquery.dcjqaccordion.2.7
//= require jquery.slimscroll
//= require nicescroll/jquery.nicescroll
//= require build/jquery.steps
//= require media/js/jquery.dataTables
//= require jquery-validate/jquery.validate.min
//= require jquery-validation-master/src/additional/alphanumeric
//= require jquery-validation-master/src/additional/pattern
//= require jquery-validation-master/src/additional/lettersonly
//= require jquery-validation-master/src/additional/nowhitespace
//= require jquery-validation-master/src/localization/messages_zh
//= require jquery-validation-custom/messages_zh
//= require jquery.inputmask
//= require jquery.inputmask.extensions
//= require jquery.inputmask.my.extensions
//= require DT_bootstrap
//= require datatable-extend
//= require twitter-bootstrap-wizard/jquery.bootstrap.wizard.min
//= require jquery.icheck
//= require jquery-timer/jquery.timer
//= require scripts
//= require select2
//= require dynamic_table/dynamic_table_init
//= require table_actionable
//= require editable-table/table-editable
//= require_tree .


var fade_flash = function() {
    $("#flash_notice").delay(5000).fadeOut("slow");
    $("#flash_alert").delay(5000).fadeOut("slow");
    $("#flash_error").delay(5000).fadeOut("slow");
};

fade_flash();

var show_ajax_message = function(msg, type) {
    $("#flash-message").html('<div id="flash_'+type+'">'+msg+'</div>');
    fade_flash();
};

$(document).ajaxComplete(function(event, request) {
    var msg = request.getResponseHeader('X-Message');
    var type = request.getResponseHeader('X-Message-Type');
		console.log(type + ':' + msg);
    show_ajax_message(msg, type); //use whatever popup, notification or whatever plugin you want
});
