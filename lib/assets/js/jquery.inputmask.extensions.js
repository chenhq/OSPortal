(function ($) {
    //extra definitions
    $.extend($.inputmask.defaults.definitions, {
        'A': {
            validator: "[A-Za-z]",
            cardinality: 1,
            casing: "upper" //auto uppercasing
        },
        '#': {
            validator: "[A-Za-z\u0410-\u044F\u0401\u04510-9]",
            cardinality: 1,
            casing: "upper"
        }
    });
    $.extend($.inputmask.defaults.aliases, {
				"ipandmask": { //ip-address and mask
						mask: "i[i[i]].i[i[i]].i[i[i]].i[i[i]]\/j[j]",
            definitions: {
                'i': {
                    validator: function (chrs, buffer, pos, strict, opts) {
                        if (pos - 1 > -1 && buffer[pos - 1] != ".") {
                            chrs = buffer[pos - 1] + chrs;
                            if (pos - 2 > -1 && buffer[pos - 2] != ".") {
                                chrs = buffer[pos - 2] + chrs;
                            } else chrs = "0" + chrs;
                        } else chrs = "00" + chrs;
                        return new RegExp("25[0-5]|2[0-4][0-9]|[01][0-9][0-9]").test(chrs);
                    },
                    cardinality: 1
                },
                'j': {
                    validator: function (chrs, buffer, pos, strict, opts) {
                        if (pos - 1 > -1 && buffer[pos - 1] != "/") {
														chrs = buffer[pos - 1] + chrs;
                        } else chrs = "0" + chrs;
                        return new RegExp("3[0-2]|2[0-9]|[01][0-9]").test(chrs);
                    },
                    cardinality: 1
                }
            }
        }
    });
})(jQuery);
