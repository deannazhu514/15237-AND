$(document).ready(function(){
    var drag;
    var turntable = $(".turntable");
    var height = turntable.height();
    
    turntable.mousedown(function() {
        drag = true;
        console.log("hey")
    })
    
    $(document).mouseup(function() {
        drag = false;
    })
    
    $(document).mousemove(function(event) {
        if (drag) {
            var radians = Math.atan2(event.pageX - height,
                                     event.pageY - height);
            var degree = -(radians * (180 / Math.PI) + 90);
            turntable.css({
                "-moz-transform": "rotate(" + degree + "deg)",
                "-webkit-transform": "rotate(" + degree + "deg)",
                "-o-transform": "rotate(" + degree + "deg)",
                "-ms-transform": "rotate(" + degree + "deg)",
                "transform": "rotate(" + degree + "deg)"
            })
        }
    })
    
    $(".turntable img").mousemove(function(event) {
        preventDefault;
    })
});