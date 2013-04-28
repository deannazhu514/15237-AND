$(document).ready(function(){
    turntable();
    openPanel();
    $("input, .picker .track").on("touchstart", function(e) {  
        $(this).trigger("active");
    });
    $("input, .picker .track").on("touchend", function(e) {  
        $(this).trigger("blur");
    });
});


function turntable() {
    var drag, turntable, height;
    
    $(".turntable").mousedown(function() {
        drag = true;
        turntable = $(this);
        height = turntable.height();
    })
    
    $(document).mouseup(function() {
        drag = false;
    })
    
    $(document).mousemove(function(event) {
        if (drag) {
            var radians = Math.atan2(event.pageX - height,
                                     event.pageY - height);
            var degree = -(radians * (180 / Math.PI));
            turntable.css({
                "-moz-transform": "rotate(" + degree + "deg)",
                "-webkit-transform": "rotate(" + degree + "deg)",
                "-o-transform": "rotate(" + degree + "deg)",
                "-ms-transform": "rotate(" + degree + "deg)",
                "transform": "rotate(" + degree + "deg)"
            })
        }
    })
    
    $(".turntable img").mousedown(function(event) {
        turntable = $(".turntable");
        event.preventDefault();
    })
}

function openPanel() {
    var buttons = $(".panel-button");
    
    buttons.click(function(){
        var id = $(this).attr("id");
        $("section#" + id).toggleClass("open");
    })
}
