var currentSound;	
var myTemplate = [
    {
        "type" : "slider",
        "orientation" : "horizontal",
        "showValue" : true
    },
    {
        "type" : "slider",
        "orientation" : "horizontal",
        "showValue" : false
    }
];

$(document).ready(function(){
    makePalette(myTemplate);
<<<<<<< HEAD

=======
	SC.stream("/tracks/69175111", function(sound){
			currentSound = sound;
			sound.play();
	});
>>>>>>> prettified things
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
        value   = (value) ? $("<span class='value'>").html($(control).val())
                          : null,
        handle  = $("<input>").attr({
            type:  "button",
            value: "=",
            class: "move"
        });

    $(control).mousemove(function(){
        $(value).html($(control).val())
		if (currentSound != null) {
			if (type === "slider" && orientation == "vertical") {
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
    
    $(handle).mousedown(function(event){
        console.log("boop")
        $dragging = $(this).parents(".palette");
    });
    
    $(document).mouseup(function(event){
        $dragging = null;
    });

    $("body").append(palette);
        $(palette).append(handle);
        $(palette).append(control);
        $(palette).append(value);
}