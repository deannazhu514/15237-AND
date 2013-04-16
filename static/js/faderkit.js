var slider = {
    "type" : "slider",
    "orientation" : "horizontal",
    "showValue" : true
};
            
function makePalette(template) {
    // Container for all controls and information for a single track
    var track  = $("<li>").addClass("track"),
        header = $("<header>"),
        title  = $("<h1>").html(template.song),
        artist = $("<author>").html(template.artist);
    var tid = template.id;
    $(header).append(artist, title);
    $(track).append(header);

    for (var i = 0; i < template.ui.length; i++) {
        var element;
        if (template.ui[i].type === "turntable") {
            element = makeTurntable(template.ui[i].art,
                                    template.ui[i].duration, tid);
        } else {
            element = makeControl(template.ui[i].type,
								  template.ui[i].name,
                                  template.ui[i].orientation,
                                  template.ui[i].showValue, tid);
        }
        
        track.append(element);
    }
    $("ul#tracks").append(track);
}

function makeTurntable(artSrc, duration, tid) {
    var turntable = $("<div>").addClass("turntable"),
        scrubber  = $("<div>").addClass("scrubber"),
        art       = $("<img>").attr({
            src:   artSrc,
            class: "art"
        });
    $(turntable).append(scrubber);
    $(turntable).append(art);
	$(turntable).attr('id',tid);
	$(turntable).click(function(){
		var tempid = tid;
		var ttable = this;
		if (sounds[tempid] == undefined) {
			SC.stream('/tracks/'+this.id, function(sound) {
			//console.log(sound);
			sounds[tempid] = sound;
			sound.play();
			$(ttable).toggleClass("playing");
			});
		} else {
			sounds[tempid].togglePause();
			$(this).toggleClass("playing");
						}
	}); 
	
	return $(turntable);
}

function makeControl(type, name, orientation, value, tid) {
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
		var val = $(control).val();
		var id = $(control).parent().attr("id");
		var sound = sounds[id];
		if (sound != undefined) {		
			if (name == "volume") {
				$(value).html(val);
				sound.setVolume(val);
			}			
			else if (name == "playback") {
				if (sound.isHTML5) {
					sound.playbackRate = val/50;
				} else { //CAN SET THE PLAY POSITION HEHEHE AND DISPLAY
					$(value).html(Math.floor(sound.position/60000)+":"+Math.floor(sound.position/1000)%60);				
				}
				console.log("change playback rate here");		
			}
				
		}
	});
   $(control).click(function(){
		var val = $(control).val();
		var id = $(control).parent().attr("id");
		var sound = sounds[id];
		if (sound != undefined) {		
			if (name == "volume") {
				$(value).html(val);
				sound.setVolume(val);
			}			
			else if (name == "playback") {
				if (sound.isHTML5) {
					sound.playbackRate = val/50;
				} else { //CAN SET THE PLAY POSITION HEHEHE AND DISPLAY
					//TODO: CHANGE PLAYBACK RATE HERE
					sound.setPosition(sound.duration*val/100);					
				}
			}		
		}		
		
    });
    
    var drag = null;

    $(handle).mousedown(function(event){
        drag = $(this).parents(".palette");
    });
    
    $(document).mousemove(function(event) {
        if (drag) {
            drag.offset({
                top:  Math.floor(event.pageY / 100) * 100,
                left: Math.floor(event.pageX / ($(window).height() / 4)) * ($(window).height() / 4)
            });
        }
    });    
    
    $(document).mouseup(function(event){
        drag = null;
    });

    $(palette).append(handle, control, value);
	$(palette).attr('id',tid);
    
    return $(palette);
}