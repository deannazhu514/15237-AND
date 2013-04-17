var ctrls = {};
var changingVol = false;

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
        indicator1 = $("<div>").attr({
            class: "indicator semi",
            id: "indicator1"
        }),
        indicator2 = $("<div>").attr({
            class: "indicator semi",
            id: "indicator2"
        }),
        mask = $("<div>").addClass("mask semi"),
        art = $("<img>").attr({
            src:   artSrc,
            class: "art"
        });
        
    $(scrubber).append(indicator1, indicator2, mask);
    $(turntable).append(scrubber, art);
	$(turntable).attr('id',tid);
	$(turntable).click(function(){
		var tempid = tid;
		var ttable = this;
		var cursound = sounds[tempid];		
		
		if (cursound == undefined) {
			var sound = {};
			var audio = new Audio();
			audio.src = tracks[tempid].url+stream_add;
			audio.addEventListener('ended', function() {
				console.log("finished playing");
				$(ttable).toggleClass("playing");
				sound.stop();
				
			});
			var source = context.createMediaElementSource(audio);	
				console.log(source);
			sound.source = source;
			sound.play = play;
			sound.togglePause = togglePause;
			sound.stop = stop;	
			sounds[tempid] = sound;
			
			sound.play();
			
			sounds[tempid] = sound;
			$(ttable).toggleClass("playing");			
	
		} else {			
			cursound.togglePause();
			console.log(cursound.source);
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
        value   = (value) ? $("<span>").addClass("value").html($(control).val())
                          : null,
        label   = $("<label>").html(name);
        handle  = $("<input>").attr({
            type:  "button",
            value: " ",
            class: "move"
        });
		var changeSlider = function(elt, elt2, pos) {
			elt.val(pos); 
			elt2.html(pos);
			console.log(pos);
		};
		
		if (name == 'volume') {
			$(control).mouseover(function(){
				changingVol = true;
			});
			
			$(control).mouseout(function() {
				changingVol = false;
			});
		}
    $(control).mousemove(function(){
		var val = $(control).val();
		var id = $(control).parent().attr("id");


		var sound = sounds[id];
		if (sound != undefined) {	
			var s = sound.source.mediaElement;
			if (name == "volume") {
				s.volume = val/100;
				$(value).html("volume:"+val);
			}			
			else if (name == "pbr") {
				$(value).html("playback:" + val/50);			
			} else if (name == "playback") {
				$(value).html(Math.floor(s.currentTime/60)+":"+Math.floor(s.currentTime%60));	
			}
		}
	});
   $(control).click(function(){
		var val = $(control).val();
		var id = $(control).parent().attr("id");
		var sound = sounds[id];
		if (sound != undefined) {	
			var s = sound.source.mediaElement;
			if (name == "volume") {
				s.volume = val/100;
				$(value).html("volume:"+val);
			}			
			else if (name == "pbr") {
				s.playbackRate = val/50;
			} else if (name == "playback") {
				s.currentTime = (s.duration*val/100);					
				$(value).html("position:"+s.currentTime);	
			}		
		}		
		
    });
		if (name == 'volume') {
			$(control).data('changeSlider', changeSlider);
			$(control).data('val', $(control));
			$(control).data('val2', $(value));
			ctrls[tid] = $(control);
		}
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

    $(palette).append(handle, control, label, value);
	$(palette).attr('id',tid);
    
    return $(palette);
}