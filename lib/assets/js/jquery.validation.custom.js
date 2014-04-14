$(document).ready(function(){

		jQuery.validator.addMethod("", function(value, element) {
				return this.optional(element) || /^[a-zA-Z0-9._\-]+$/.test(value);
		}, "Please specify the correct domain for your documents");

})
