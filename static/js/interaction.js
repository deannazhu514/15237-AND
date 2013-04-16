$(document).ready(function(){
    turntable();
    openPanel();
});

function turntable() {
    var drag,
        turntable = $(".turntable"),
        height = turntable.height();
    
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
        event.preventDefault();
    })

}

function openPanel() {
    var buttons = $(".panel-button");
    
    buttons.click(function(){
        var id = $(this).attr('id');
        $("section#" + id).toggleClass("open");
    })
}
