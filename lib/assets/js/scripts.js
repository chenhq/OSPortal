jQuery(function($) {
		//left side accordion
    $('#nav-accordion').dcAccordion({
        eventType: 'click',
        autoClose: true,
        saveState: true,
        disableLink: true,
        speed: 'slow',
        showCount: false,
        autoExpand: true,
        classExpand: 'dcjq-current-parent'
    });


    // //  menu auto scrolling
    // $(".leftside-navigation .sub-menu > a").click(function () {
    //     var o = ($(this).offset());
    //     diff = 80 - o.top;
    //     if(diff>0)
    //         $(".leftside-navigation").scrollTo("-="+Math.abs(diff),500);
    //     else
    //         $(".leftside-navigation").scrollTo("+="+Math.abs(diff),500);
    // });
		
    $('.sidebar-toggle-box .fa-bars').click(function (e) {
        $(".leftside-navigation").niceScroll({
            cursorcolor:"#1FB5AD",
            cursorborder:"0px solid #fff",
            cursorborderradius:"0px",
            cursorwidth:"3px"
        });

        $('#sidebar').toggleClass('hide-left-bar');
        if($('#sidebar').hasClass('hide-left-bar')){
            $(".leftside-navigation").getNiceScroll().hide();
        }
        $(".leftside-navigation").getNiceScroll().show();
        $('#main-content').toggleClass('merge-left');
        e.stopPropagation();
        if( $('#container').hasClass('open-right-panel')){
            $('#container').removeClass('open-right-panel')
        }
        if( $('.right-sidebar').hasClass('open-right-bar')){
            $('.right-sidebar').removeClass('open-right-bar')
        }

        if( $('.header').hasClass('merge-header')){
            $('.header').removeClass('merge-header')
        }


    });
    $('.toggle-right-box .fa-bars').click(function (e) {
        $('#container').toggleClass('open-right-panel');
        $('.right-sidebar').toggleClass('open-right-bar');
        $('.header').toggleClass('merge-header');

        e.stopPropagation();
    });

    $('.header,#main-content,#sidebar').click(function () {
       if( $('#container').hasClass('open-right-panel')){
           $('#container').removeClass('open-right-panel')
       }
        if( $('.right-sidebar').hasClass('open-right-bar')){
            $('.right-sidebar').removeClass('open-right-bar')
        }

        if( $('.header').hasClass('merge-header')){
            $('.header').removeClass('merge-header')
        }


    });



    /*Slim Scroll*/
    $(function () {
        $('.event-list').slimscroll({
            height: '305px',
            wheelStep: 20
        });
        $('.conversation-list').slimscroll({
            height: '360px',
            wheelStep: 35
        });
        $('.to-do-list').slimscroll({
            height: '300px',
            wheelStep: 35
        });
        $(".leftside-navigation").niceScroll({
            cursorcolor:"#1FB5AD",
            cursorborder:"0px solid #fff",
            cursorborderradius:"0px",
            cursorwidth:"3px"
        });

        $(".leftside-navigation").getNiceScroll().resize();
        if($('#sidebar').hasClass('hide-left-bar')){
            $(".leftside-navigation").getNiceScroll().hide();
        }
        $(".leftside-navigation").getNiceScroll().show();
//        $('.sidebar-menu').slimscroll({
//            height: '100%',
//            wheelStep: 1,
//            railVisible: true,
////      alwaysVisible: true,
//            color: '#1FB5AD',
//            size: '3px',
//            railColor: '#333',
//            railOpacity: 0.5,
//            opacity : .8,
//            borderRadius: '0px',
//            railBorderRadius: '0px',
//            allowPageScroll: false
//        });

        $(".right-stat-bar").niceScroll({
            cursorcolor:"#1FB5AD",
            cursorborder:"0px solid #fff",
            cursorborderradius:"0px",
            cursorwidth:"3px"
        });
//        $('.right-side-accordion').slimscroll({
//            height: '94%',
//            wheelStep: 1,
//            railVisible: true,
////      alwaysVisible: true,
//            color: '#1FB5AD',
//            size: '3px',
//            railColor: '#333',
//            railOpacity: 0.5,
//            opacity : .8,
//            borderRadius: '0px',
//            railBorderRadius: '0px'
//        });



    });



    // custom scroll bar
//    $("#sidebar").niceScroll({styler:"fb",cursorcolor:"#1FB5AD", cursorwidth: '3', cursorborderradius: '10px', background: '#404040', spacebarenabled:false, cursorborder: ''});
//    $(".right-sidebar").niceScroll({styler:"fb",cursorcolor:"#1FB5AD", cursorwidth: '3', cursorborderradius: '10px', background: '#404040', spacebarenabled:false, cursorborder: ''});


   // widget tools

    $('.panel .tools .fa-chevron-down').click(function () {
        var el = $(this).parents(".panel").children(".panel-body");
        if ($(this).hasClass("fa-chevron-down")) {
            $(this).removeClass("fa-chevron-down").addClass("fa-chevron-up");
            el.slideUp(200);
        } else {
            $(this).removeClass("fa-chevron-up").addClass("fa-chevron-down");
            el.slideDown(200);
        }
    });

    $('.panel .tools .fa-times').click(function () {
        $(this).parents(".panel").parent().remove();
    });

   // tool tips

    $('.tooltips').tooltip();

    // popovers

    $('.popovers').popover();


    $("#wizard").steps({
        headerTag: "h4",
        bodyTag: "section",
        transitionEffect: "slideLeft"
    });

    $('.square-yellow input').iCheck({
        checkboxClass: 'icheckbox_square-yellow',
        radioClass: 'iradio_square-yellow',
        increaseArea: '1%' // optional
    });

		$('#ssh-login input').on('ifChecked', function(event){
				$('#ssh-login-option .form-group').hide();
				$($(this).attr("option")+ ' .form-group').show();
		});
		
		$('#ssh-login input[option="#ssh-login-password"]').iCheck('check');

		
		$('#images-table input:radio[name=image-radio]').on('ifChecked', function(event) {
				var username = $(this).parents('td').siblings('.username').text();
				$(this).parents('form').find('#username').val(username);
		});

		$('input:radio[name=image-radio]:first').iCheck('check');

});

