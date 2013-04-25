var ctrls = {};
var changingVol = false;
var changingPBR = false;
var changingPB = false;
var intids = {};

var colors = ["red","orange","yellow"]

var slider = {
    "type" : "slider",
    "orientation" : "horizontal",
    "showValue" : true
};

$(document).ready(function(){
    var sets = [{
        "name" : "my first set",
        "tracks" : [{
            "id": "track.id",
            "artist": "track.user.username",
            "song": "track.title",
            "url" : "track.stream_url"
        },
        {
            "id": "track.id",
            "artist": "track.user.username",
            "song": "track.title",
            "url" : "track.stream_url"
        }]
    },
    {
        "name" : "my second set",
        "tracks" : [{
            "id": "track.id",
            "artist": "track.user.username",
            "song": "track.title",
            "url" : "track.stream_url"
        },
        {
            "id": "track.id",
            "artist": "track.user.username",
            "song": "track.title",
            "url" : "track.stream_url"
        }]
    },
    {
        "name" : "my third set",
        "tracks" : [{
            "id": "track.id",
            "artist": "track.user.username",
            "song": "track.title",
            "url" : "track.stream_url"
        },
        {
            "id": "track.id",
            "artist": "track.user.username",
            "song": "track.title",
            "url" : "track.stream_url"
        },
        {
            "id": "track.id",
            "artist": "track.user.username",
            "song": "track.title",
            "url" : "track.stream_url"
        },
        {
            "id": "track.id",
            "artist": "track.user.username",
            "song": "track.title",
            "url" : "track.stream_url"
        },
        {
            "id": "track.id",
            "artist": "track.user.username",
            "song": "track.title",
            "url" : "track.stream_url"
        },
        {
            "id": "track.id",
            "artist": "track.user.username",
            "song": "track.title",
            "url" : "track.stream_url"
        },
        {
            "id": "track.id",
            "artist": "track.user.username",
            "song": "track.title",
            "url" : "track.stream_url"
        },
        {
            "id": "track.id",
            "artist": "track.user.username",
            "song": "track.title",
            "url" : "track.stream_url"
        }]
    },
    {
        "name" : "my fourth set",
        "tracks" : [{
            "id": "track.id",
            "artist": "track.user.username",
            "song": "track.title",
            "url" : "track.stream_url"
        },
        {
            "id": "track.id",
            "artist": "track.user.username",
            "song": "track.title",
            "url" : "track.stream_url"
        }]
    }];
    
    makePicker(sets);
})
            
function makePalette(template) {
		if (typeof(template.id) == 'string') {
			template.id = parseFloat(template.id);
		}
		
		console.log(typeof(template.id));
					trackList[template.id] = {
						playing: false,
						pbr: 1.0,
						volume: 1.0,
						time: 0,
						setTime: false
					};
    // Container for all controls and information for a single track
    var track    = $("<li>").addClass("track"),
        header   = $("<header>"),
		title    = $("<h1>").html(template.song),
        artist   = $("<author>").html(template.artist),
        controls = $("<ul>").addClass("controls"),
        tid      = template.id;
    $(header).append(title, artist);
    console.log('tid: ' + tid);
    for (var i = 0; i < template.ui.length; i++) {
        var element;
        if (template.ui[i].type === "turntable") {
			if (nonstream) {
				element = makeTurntable2(template.ui[i].art,
                          template.ui[i].duration, tid);
			} else {
                element = makeTurntable(template.ui[i].art,
                          template.ui[i].duration, tid);
			}
		track.append(element);
        } else {
            element = makeControl(template.ui[i].type,
								  template.ui[i].name,
                                  template.ui[i].orientation,
                                  template.ui[i].showValue, tid, template.ui[i].duration);
            controls.append(element);
        }
        track.append(controls);
    }
    $(track).append(header);
    $("ul#tracks").append(track);
}

function makeTurntable2(artSrc, duration, tid) {
		console.log(typeof(tid));
    var turntable = $("<div>").addClass("turntable"),
        scrubber   = $("<div>").addClass("scrubber"),
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
    	
    	
    	//cursound.togglePause();
    	//trackList[tempid].playing = !trackList[tempid].playing;
		
		if (trackList[tempid].playing) {
			socket.emit('pause',tid);
		} else {
			socket.emit('play',tid);
		}
		$(this).toggleClass("playing");	
	
	}); 
	return $(turntable);
}

// Called after volume change
function volumeGlow(vol, item) {
    var glow = vol * 2
    $(item).css({
        "box-shadow": "0 0 " + glow + "px " + colors[1]
    })
}

function makeTurntable(artSrc, duration, tid) {
    var turntable  = $("<div>").addClass("turntable"),
        scrubber   = $("<div>").addClass("scrubber"),
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
    	// default glow when playing starts
    	volumeGlow(50, turntable);
		var tempid = tid;
		var ttable = this;
		var cursound = sounds[tempid];	
		console.log(tempid);
		console.log(typeof(tempid));
		if (cursound == undefined && (!nonstream)) {

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
			//sound.play();
			
			sounds[tempid] = sound;

			if(trackList[tempid] == undefined) {
				alert('wat');
			}
			if(trackList[tempid].playing) {
				socket.emit('pause',tid);
			} else {
				socket.emit('play',tid);
			}
			//trackList[tempid].playing = !trackList[tempid].playing;
			//cursound = sound;
			//console.log(cursound.source.mediaElement.paused);
			console.log(trackList[tempid].playing);
			$(ttable).toggleClass("playing");			
			// remove glow

			
			if (cursound) {
				 var id = $(control).parent().attr("id");
				 var s = sounds[id].source.mediaElement;
				setInterval(function () {
					if (name == "playback") {
					    $(value).html(Math.floor(s.currentTime/60)+":"+Math.floor(s.currentTime%60));	
					}
				}, 1000);

			}		
		} else {			
    		volumeGlow(0, turntable);
			//cursound.togglePause();
			//trackList[tempid].playing = !trackList[tempid].playing;
			if(trackList[tempid].playing) {
				socket.emit('pause',tid);
			} else {
				socket.emit('play',tid);
			}
			console.log(cursound.source.mediaElement.paused);
			$(this).toggleClass("playing");	
		}
	});
	return $(turntable);
}

function makeControl (type, name, orientation,
                      showValue, tid, duration) {
    var palette = $("<li>").addClass("palette"),
        inputType = (type === "slider") ? "range" : "button",
        control = $("<input>").attr({
                      type:  inputType,
                      class: type + " " + orientation,
                  }),
        value   = $("<span>").addClass("value").html($(control).val()),
        label   = $("<label>").html(name),
        handle  = $("<input>").attr({
            type:  "button",
            value: " ",
            class: "move"
        });
        
    var changeSlider = function(elt, elt2, pos) {
        elt.val(pos);
    };

	if (name === 'volume') {
		$(control).mouseover(function(){
			changingVol = true;
		});
		$(control).mouseout(function() {
			changingVol = false;
		});
	}
	
	if (name === 'pbr') {
		$(control).mouseover(function(){
			changingPBR = true;
		});
		$(control).mouseout(function() {
			changingPBR = false;
		});
	}
	
    $(control).mousemove(function(){
		var val = $(control).val();
		var id = $(control).parent().attr("id");
		function setTime() {
		}
		/*
		var sound = sounds[id];
		if (sound != undefined) {
			var s = sound.source.mediaElement;
			if (name == "volume") {
				$(value).html(val);
				change_volume(id,val/100);
			}
			else if (name == "pbr") {
				//s.volume = val/100;
				//$(value).html("volume:"+val);
			} else if (name == "playback") {
    			
            }
		}*/
	});
	
   $(control).click(function(){
		var val = $(control).val(),
		    id  = $(control).parent().attr("id");
		//var sound = sounds[id];
		if (true) {
			//var s = sound.source.mediaElement;
			if (name == "volume") {
				//s.volume = val/100;
				change_volume(id,val/100);
				$(value).html("volume:"+val);
				// Set visual glow of volume
				volumeGlow(val,
    			$(this).parent().siblings(".turntable"));
			} else if (name == "pbr") {
				change_speed(id,val/50);
				
				//s.playbackRate = val/50;
			} else if (name == "playback") {
				//s.currentTime = (s.duration*val/100);					
				change_time(id,duration*val/100);
				$(value).html("position:"+duration*val/100);
			}
		}
		
    });
		
		/*
		var fff = function(id,v) {
			id.clearInterval();
			
		};
		var iid = setInterval(fff(tid, $(value)), 1000);
		
		if (name == 'playback') {
					
				var func = function(song, v) {
					v.html(Math.floor(song.currentTime/60)+":"+Math.floor(song.currentTime%60));
					console.log('awk');
				};
				if (trackList[tid] != undefined && !trackList[tid].setTime) {
					console.log('yo');
					window.setInterval(func(sounds[tid],$(value)), 100);
					trackList[tid].setTime = true;
				}
		} */
	if (ctrls[tid] == undefined) {
			ctrls[tid] = {};
		}
	if (name == 'volume') {

		$(control).data('changeSlider', changeSlider);
		$(control).data('val', $(control));
		$(control).data('val2', $(value));
		ctrls[tid]['vol'] = $(control);
	} 
	if (name == 'pbr') {
		$(control).data('changeSlider', changeSlider);
		$(control).data('val', $(control));
		$(control).data('val2', $(value));
		ctrls[tid]['pbr'] = $(control);
	}
	if (name == 'playback') {
				$(control).data('changeSlider', changeSlider);
		$(control).data('val', $(control));
		$(control).data('val2', $(value));
		ctrls[tid]['pb'] = $(control);
	}
	
    // var drag = null;
    // $(handle).mousedown(function(event){
    //     drag = $(this).parents(".palette");
    // });
    // 
    // $(document).mousemove(function(event) {
    //     if (drag) {
    //         drag.offset({
    //             top:  Math.floor(event.pageY / 100) * 100,
    //             left: Math.floor(event.pageX / ($(window).height() / 4)) * ($(window).height() / 4)
    //         });
    //     } 
    // });    
    // 
    // $(document).mouseup(function(event){
    //     drag = null;
    // });
		
    if (name === 'playback') {
        $(value).html("0:00");
        $(control).val(0);
    }

    $(palette).append(control, label);
    
    if (showValue == 'true') {
        $(palette).append(value);
        console.log("val")
    }
	$(palette).attr('id',tid);
    
    return $(palette);
}

// SET & TRACK PICKING UI

function makePicker(sets) {
    var picker = $("<section>").addClass("picker");
    console.log("MAKE PICKER")
    for (var i = 0; i < sets.length; i++) {
        var set     = sets[i].tracks,
            section = $("<section>").addClass("set"),
            ul      = $("<ul>").addClass("tracks"),
            h1      = $("<h1>").html(sets[i].name);
            section.append(h1, ul);
            
        for (var j = 0; j < set.length; j++) {
            var track = set[j],
                li    = $("<li>").addClass("track"),
                title = $("<h1>").html(set[j].song).addClass("title"),
                author = $("<author>").html(set[j].artist).addClass("author");
            li.append(title, author);
            ul.append(li);
        }
        picker.append(section);
    }
    $("body > header").append(picker);
}