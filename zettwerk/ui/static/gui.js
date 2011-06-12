jq(document).ready(function() {
    enablePersonalTool();
    enableForms();
    enableDialogs();
    enableTabs();
    enableGlobalTabs();
    enableEditBar();
});

var enablePersonalTool = function() {
    // enable overlay, cause the id is changed
    // taken from Products.CMFPlone.skins.plone_ecmascript/popupforms.js
    jq('#portal-personaltools-ui a[href$="/login"], #portal-personaltools-ui a[href$="/login_form"]').prepOverlay(
        {
            subtype: 'ajax',
            filter: common_content_filter,
            formselector: 'form#login_form',
            noform: function () {
                if (location.href.search(/pwreset_finish$/) >= 0) {
                    return 'redirect';
                } else {
                    return 'reload';
                }
            },
            redirect: function () {
                var href = location.href;
                if (href.search(/pwreset_finish$/) >= 0) {
                    return href.slice(0, href.length-14) + 'logged_in';
                } else {
                    return href;
                }
            }
        }
    );

    // custom stuff
    jq('#portal-personaltools-ui').hover(function() {
        jq(this).addClass('ui-state-hover');
    }, function() {
        jq(this).removeClass('ui-state-hover');
    });
    jq('#portal-personaltools-ui dd a').hover(function() {
        jq(this).addClass('ui-state-hover');
    }, function() {
        jq(this).removeClass('ui-state-hover');
    });
};

var forms_are_enabled = false; // gets set via tool.js()
var enableForms = function($content) {
    if (!$content) {
	var $content = jq('body');
    }
    $content.find('.optionsToggle').removeClass('optionsToggle');
    $content.find('select, textarea, input:text, input:password').bind({
	focusin: function() {
            jq(this).addClass('ui-state-focus');
        },
        focusout: function() {
            jq(this).removeClass('ui-state-focus');
        }
    });

    $content.find('input:checkbox').each(function() {
    	var $input = jq(this);
    	var $span_container = $input.parent();
    	var $input_span = $span_container.find('span');
    	var $input_label = $span_container.find('label');

    	var handleCheckboxClick = function(switchInput) {
    	    $input_span.toggleClass("ui-state-active");
    	    $input_label.toggleClass("ui-icon ui-icon-check");

    	    // see http://www.bennadel.com/blog/1525-jQuery-s-Event-Triggering-Order-Of-Default-Behavior-And-triggerHandler-.htm
    	    // for why to not use .click() here
    	    if (switchInput) {
    		$input[0].checked = !$input[0].checked;
    		$input.triggerHandler("click");
    	    }
    	}
    	// handle clicks on the checkbox
    	$input_span.click(function() {
    	    handleCheckboxClick(true);
    	});
    	$input_span.change(function() {
    	    console.log("checked");
    	})

    	// and on labels for this, if exists
    	var $extra_label = $span_container.parent().find('label:last');
    	if ($extra_label.attr('for') == $input.attr('id')) {
    	    $extra_label.click(function() {
    		handleCheckboxClick(false);
    	    });
    	}

    	// initialize already checked ones
    	if ($input.attr('checked')) {
    	    handleCheckboxClick(false);
    	}
    });

    // $content.find('input:radio').each(function() {
    // 	var $label = jq('<label />').insertBefore(jq(this));
    // 	jq(this).hide();
    // 	$label.addClass("ui-icon ui-icon-radio-off");
    // 	$label.wrap('<span class="ui-widget-content ui-corner-all" style="display:inline-block;width:16px;height:16px;margin-right:5px;"/>');
    // 	if (jq(this).attr('disabled')) {
    //         $label.parent().addClass('ui-state-disabled');
    // 	} else {
    // 	    $label.parent().addClass('hover');
    // 	    $label.parent("span").click(function(event) {
    // 		if (jq(this).next().attr('checked')) {
    // 		    return // do nothing, if radiobox is already checked
    // 		}
    // 		// disable other radios of this group
    // 		var radio_name = jq(this).parent().find('input:radio').attr('name');
    // 		var radio_value = jq(this).parent().find('input:radio').val();
    // 		$content.find('input:radio[name='+radio_name+']').each(function() {
    // 		    if (jq(this).val() != radio_value && jq(this).attr('checked')) {
    // 			jq(this).parent().find('label').parent('span').toggleClass("ui-state-active");
    // 			jq(this).parent().find('label').toggleClass("ui-icon-radio-off ui-icon-bullet");
    // 			jq(this).next().click();
    // 		    }
    // 		});
    // 		// check this radio
    // 		jq(this).toggleClass("ui-state-active");
    // 		$label.toggleClass("ui-icon-radio-off ui-icon-bullet");
    // 		jq(this).next().click();
    // 	    });
    // 	};
    // 	// initialize already checked ones
    // 	if (jq(this).attr('checked')) {
    // 	    $label.parent("span").toggleClass("ui-state-active");
    // 	    $label.toggleClass("ui-icon-radio-off ui-icon-bullet");
    // 	}
    // });

    $content.find(".hover").hover(function(){
        jq(this).addClass("ui-state-hover");
    },function(){
        jq(this).removeClass("ui-state-hover");
    });
}

var enableDialogs = function() {
    jq("a.link-overlay").unbind('click').click(function() {
        // remove old dialogs
        jq('#dialogContainer').remove();

        // use the links content as default title of the dialog
        var title = jq(this).html();
        $.get(jq(this).attr('href'),
              {},
	      function(data) {
		  showDialogContent(data,title)
	      }
	     );
        return false; // avoid the execution of the regular link
    });
};

var showDialogContent = function(data, title) {
    var $content = jq(data).find('#content');

    // take the first heading as dialog title, if available
    $content.find('h1.documentFirstHeading').each(function() {
        title = jq(this).html();
        jq(this).hide();
    });
    jq('<div id="dialogContainer" title="'+title+'"></div>').appendTo('body');

    // search for submit buttons and use them as dialog buttons
    var buttons = {};
    $content.find('input[type=submit]').each(function() {
        var buttonValue = jq(this).val();
        buttons[buttonValue] = function() {
            jq('input[type=submit][value='+buttonValue+']').click();
        };
        jq(this).hide();
    });

    // bring up the dialog
    $content.appendTo('#dialogContainer');
    if (forms_are_enabled) {
	enableForms($content);
    }
    var $dialog = jq('#dialogContainer').dialog({width: '60%', buttons: buttons});
};

var enableTabs = function() {
    jq('div.ui-tabs ul li').hover(function() {
        jq(this).addClass('ui-state-hover');
        jq(this).find('span').addClass('ui-state-hover');
    }, function() {
        jq(this).removeClass('ui-state-hover');
        jq(this).find('span').removeClass('ui-state-hover');
    });
    jq('div.ui-tabs li a').click(function() {
	// handle the tabs
        jq(this).parent().parent().find('.ui-state-active').removeClass('ui-state-active');
        jq(this).parent().addClass('ui-state-active');
        jq(this).find('span').addClass('ui-state-active');

	// hide all fieldsets
	jq('div.ui-tabs fieldset, div.ui-tabs dd').hide()
	var active_id = jq(this).attr('href');  // thats the hidden legend in the fieldset
	var $active = jq(active_id);
	if ($active[0].tagName.toLowerCase() == 'dd') {
	    $active.show();
	} else {
	    $active.parent().show();
	}
	return false;
    });
    jq('ul.ui-tabs-nav').find('.selected').parent().addClass('ui-state-active');
};

var enableGlobalTabs = function() {
    jq('#portal-globalnav-ui > li').hover(function() {
        jq(this).addClass('ui-state-hover');
    }, function() {
        jq(this).removeClass('ui-state-hover');
    });
};

var edit_bar_interval = null;
var enableEditBar = function() {
    edit_bar_interval = window.setInterval('enableEditBar2()', 100);
}

var enableEditBar2 = function() {
    if (jq('#edit-bar-ui').length) {
	window.clearInterval(edit_bar_interval);

	jq('#content-views-ui li a').hover(function() {
	    jq(this).addClass('ui-state-hover');
	}, function() {
	    jq(this).removeClass('ui-state-hover');
	});
	jq('#content-views-ui li a').css('border', '0').css('line-height', '2em');

	jq('#contentActionMenus-ui dl.actionMenu').hover(function() {
	    jq(this).addClass('ui-state-hover ui-corner-bottom').css('border', '0px');
	}, function() {
	    jq(this).removeClass('ui-state-hover ui-corner-bttom');
	});

	jq('#contentActionMenus-ui a.actionMenuSelected').addClass('ui-state-default ui-corner-all');
	jq('#contentActionMenus-ui a').addClass('ui-corner-all');
	jq('#contentActionMenus-ui a').hover(function() {
	    jq(this).addClass('ui-state-hover');
	}, function() {
	    jq(this).removeClass('ui-state-hover');
	});

	jq('dd.actionMenuContent').addClass('ui-state-active');
    }
}