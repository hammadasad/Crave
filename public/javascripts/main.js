$(document).ready(function(){
    var $container = $("#container");
    $container.imagesLoaded(function(){
        $container.masonry({
        	itemSelector: '.item'
        });
    });
    vex.defaultOptions.className = 'vex-theme-wireframe';
    vex.dialog.open({
    	    message: "I'm craving: ",
    		input: "<input type='text' name='food' placeholder='<Food>' required />",
    		showCloseButton: false,
    		escapeButtonCloses: false,
    		overlayClosesOnClick: false,
    		buttons: [
                $.extend({}, vex.dialog.buttons.YES, {text: 'Now!'}),
                $.extend({}, vex.dialog.buttons.NO, {text: 'Choose For Me'})
    		],
    		callback: function(data) {
                if(data === false) {
                    doPost('/doAction', 'random');
                } else {
                    doPost('/doAction', data.food);
                }
    		}
    });
});

//Does post and then redirects page to new template
var doPost = function(route, info) {
    $.post(route, { data: info }).done(function(data){
           window.location="/main";
    });
}