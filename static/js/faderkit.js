var currentSound;	
var myTemplate = {
    "artist" : "artist name",
    "song" : "Song Title",
    "ui" :  [
        {
            "type" : "turntable",
            "artist" : "asdfasfd",
            "song" : "asdfasdf",
            "art" : "http://placekitten.com/500",
            "duration" : 120
        },
        {
            "type" : "slider",
            "orientation" : "horizontal",
            "showValue" : true
        },
        {
            "type" : "slider",
			"name" : "vol",
            "orientation" : "horizontal",
            "showValue" : true
        }
    ]
}

$(document).ready(function(){
    makePalette(myTemplate);
});

function makePalette(template) {
    // Container for all controls and information for a single track
    var track  = $("<section>").addClass("track"),
        header = $("<header>"),
        title  = $("<h1>").html(template.song),
        artist = $("<author>").html(template.artist);
    
    $(header).append(artist, title);
    $(track).append(header);

    for (var i = 0; i < template.ui.length; i++) {
        var element;
        if (template.ui[i].type === "turntable") {
            element = makeTurntable(template.ui[i].art,
                                    template.ui[i].duration);
        } else {
            element = makeControl(template.ui[i].type,
                                  template.ui[i].orientation,
                                  template.ui[i].showValue);
        }
        
        track.append(element);
    }
    $("body").append(track);
}

function makeTurntable(artSrc, duration) {
    var turntable = $("<div>").addClass("turntable"),
        scrubber  = $("<div>").addClass("scrubber"),
        art       = $("<img>").attr({
            src:   artSrc,
            class: "art"
        });
    $(turntable).append(scrubber);
    $(turntable).append(art);
    return $(turntable);
}

function makeControl(type, orientation, value) {
    var palette = $("<section>").addClass("palette"),
        inputType = (type === "slider") ? "range" : "button",
        control = $("<input>").attr({
                      type:  inputType,
                      class: type + " " + orientation,
                  }),
        value   = (value) ? $("<span class='value'>").html($(control).val())
                          : null,
        handle  = $("<input>").attr({
            type:  "button",
            value: " ",
            class: "move"
        });

    $(control).mousemove(function(){
        $(value).html($(control).val())
		if (currentSound != null) {
			if (name == "vol") {
				currentSound.setVolume($(control).val());
			}
		}
    });
    
    var $dragging = null;
    
    $("body").mousemove(function(event) {
        if ($dragging) {
            $dragging.offset({
                top:  Math.floor(event.pageY / 100) * 100,
                left: Math.floor(event.pageX / ($(window).height() / 4)) * ($(window).height() / 4)
            });
        }
    });
    
    $(handle).mousedown(function(event){
        $dragging = $(this).parents(".palette");
    });
    
    $(document).mouseup(function(event){
        $dragging = null;
    });

    $(palette).append(handle, control, value);
    
    return $(palette);
}