var myTemplate = [
    {
        "type" : "slider",
        "orientation" : "vertical",
        "showValue" : true
    },
    {
        "type" : "slider",
        "orientation" : "vertical",
        "showValue" : false
    }
];

$(document).ready(function(){
    makePalette(myTemplate);
});

function makePalette(template) {
    for (var i = 0; i < template.length; i++) {
        makeControl(template[i].type,
                    template[i].orientation,
                    template[i].showValue);
    }
}

function makeControl(type, orientation, value) {
    var palette = $("<section>").addClass("palette"),
        control = $("<input>").attr({
            type:  "range",
            class: type,
        }),
        value   = (value) ? $("<span>").html($(control).val())
                          : null;

    $(control).mousemove(function(){
        $(value).html($(control).val())
    });
    
    var $dragging = null;
    
    $("body").mousemove(function(event) {
        if ($dragging) {
            $dragging.offset({
                top:  event.pageY,
                left: event.pageX
            });
        }
    });
    
    $("body").mousedown(function(event){
        $dragging = $(event.target);
    });
    
    $("body").mouseup(function(event){
        $dragging = null;
    });

    $("body").append(palette);
        $(palette).append(control);
        $(palette).append(value);
}