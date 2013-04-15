$(document).ready(function(){
    var drag;
    var turntable = $(".turntable");
    var height = turntable.height();
    
    turntable.mousedown(function() {
        drag = true;
        console.log('hey')
    })
    
    $(document).mouseup(function() {
        drag = false;
    })
    
    $(document).mousemove(function(e) {
        if (drag) {
            var radians = Math.atan2(e.pageX - height, e.pageY - height);
            var degree = -(radians * (180 / Math.PI) + 90);
            turntable.css('-moz-transform', 'rotate(' + degree + 'deg)');
            turntable.css('-webkit-transform', 'rotate(' + degree + 'deg)');
            turntable.css('-o-transform', 'rotate(' + degree + 'deg)');
            turntable.css('-ms-transform', 'rotate(' + degree + 'deg)');
        }
    })
    
    $(".turntable img").mousemove(function(e) {
        preventDefault;
    })
});