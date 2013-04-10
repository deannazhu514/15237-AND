var currentSound;	
var myTemplate = [
    {
        "type" : "slider",
        "orientation" : "vertical",
        "showValue" : true
<<<<<<< HEAD
=======
    },
    {
        "type" : "slider",
        "orientation" : "horizontal",
        "showValue" : false
>>>>>>> refined controls
    }
];

$(document).ready(function(){
    makePalette(myTemplate);
	SC.stream("/tracks/69175111", function(sound){
			currentSound = sound;
			sound.play();
	});

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
            class: type + " " + orientation,
        }),
        value   = (value) ? $("<span>").html($(control).val())
                          : null;

    $(control).mousemove(function(){
        $(value).html($(control).val())
		if (currentSound != null) {
			if (type === "slider") {
				currentSound.setVolume($(control).val());
			}
		}
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
    
    $(".palette").mousedown(function(event){
        console.log("boop")
        $dragging = $(this);
    });
    
    $(document).mouseup(function(event){
        $dragging = null;
    });

    $("body").append(palette);
        $(palette).append(control);
        $(palette).append(value);
}