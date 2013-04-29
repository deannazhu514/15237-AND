var ctrls = {};
var controlChanging = false;
var changingVol = false;
var changingPBR = false;
var changingPB = false;
var intids = {};
var setlist = [];

var colors = ["red","orange","yellow"]

var slider = {
    "type" : "slider",
    "orientation" : "horizontal",
    "showValue" : true
};

//source code: http://www.hardcode.nl/subcategory_1/article_414-copy-or-clone-javascript-array-object

function cloneObject(source) {
    for (i in source) {
        if (typeof source[i] == 'source') {
            this[i] = new cloneObject(source[i]);
        }
        else{
            this[i] = source[i];
	}
    }
}
 


function constructSetList() {
	for (key in playlists) {
		
		console.log("KEY IS : " +key);
		var temptracks = $.map(playlists[key].tracks, function (value, key) { return value; });
		
		//sort temptracks
		var i = 0;
		while (i < playlists[key].length) {
			if (temptracks[i].i != i) {
				var temp = new cloneObject(temptracks[i]);
				var tempind = 
				console.log(temp);
				temptracks[i] = new cloneObject(temptracks[temp.i]);
				temptracks[temp.i] = temp;
				i = 0;
				
			}
			else {
			i++;
			}
		}
		for (var j = 0; j < temptracks.length; j++) {
			console.log("TEMPTRACKS IS: ", temptracks[j]);
		}
		console.log(temptracks);
		
		var tempobj = {name: playlists[key].name, 
									tracks: temptracks};
		setlist.push(tempobj);
	}
}

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
        "name" : "my fifth set",
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
    
    //makePicker(sets);
})
            
function makePalette(template) {
	if (typeof(template.id) === 'string') {
		template.id = parseFloat(template.id);
	}

	console.log(typeof(template.id));
	trackList[template.id] = {
			playing: false,
			ended: false,
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
    $(header).append(artist, title);
    $(track).append(header);
    console.log('tid: ' + tid);
    for (var i = 0; i < template.ui.length; i++) {	
        var element;
        if (template.ui[i].type === "turntable") {
		
			if (nonstream) {
				element = makeTurntable2(template.ui[i].art,
                          template.ui[0].duration, tid);
			} else {
                element = makeTurntable(template.ui[i].art,
                          template.ui[0].duration, tid);
			}
			track.append(element);
        } else {
            element = makeControl(template.ui[i].type,
								  template.ui[i].name,
                                  template.ui[i].orientation,
                                  template.ui[i].showValue, tid, template.ui[0].duration);
            controls.append(element);
        }
        track.append(controls);
    }
    $("ul#tracks").append(track);
		return element;
}

function makeTurntable2(artSrc, duration, tid) {
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
			$(this).toggleClass("playing",false);
		} else {
			socket.emit('play',tid);
			$(this).toggleClass("playing",true);
		}
		
	 //$(this).toggleClass("playing");	
	
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
		
		/*if (cursound === undefined && (!nonstream)) {
			console.log("hehehe");
			var sound = {};
			var audio = new Audio();
			audio.src = tracks[tempid].url+stream_add;
			
			audio.addEventListener('ended', function() {
				console.log("finished playing");
				$(ttable).toggleClass("playing");
				sound.stop();
				if (autoplay) {
					console.log("playing next track");
					
				} else {
					console.log("stopped");
				}
			});
			
			var source = context.createMediaElementSource(audio);	
			//console.log(source);
			sound.source = source;
			sound.play = play;
			sound.togglePause = togglePause;
			sound.stop = stop;	
			sounds[tempid] = sound;

			if(trackList[tempid].playing) {
				socket.emit('pause',tid);
			} else {
				socket.emit('play',tid);
			}
			console.log(trackList[tempid].playing);
			$(ttable).toggleClass("playing");			
			
			// remove glow
			if (cursound) {
				 var id = $(control).parent().attr("id");
				 var s = sounds[id].source.mediaElement;
					setInterval(function () {
					if (name === "playback") {
					    $(value).html(Math.floor(s.currentTime/60)+":"+Math.floor(s.currentTime%60));	
					}
				}, 1000);

			}		
		} else {	
		*/
		
    		volumeGlow(5, turntable);
			console.log(trackList[tempid].playing);
			if(trackList[tempid].playing) {			
				socket.emit('pause',tid);
				$(this).toggleClass("playing", false);	
			} else {
				socket.emit('play',tid);
				$(this).toggleClass("playing", true);	
			}
			//$(this).toggleClass("playing");	
		//}
	});
	//turntable();
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

	/*if (name === 'volume') {
		$(control).mouseover(function(){
			changingVol = true;
		});
		$(control).mouseout(function() {
			changingVol = false;
		});
	}*/
	
	if (name === 'pbr') {
		$(control).mouseover(function(){
			changingPBR = true;
		});
		$(control).mouseout(function() {
			changingPBR = false;
		});
	}
	
	function updateControls() {
        var val = $(control).val(),
        	id  = $(control).parent().attr("id");
        if (name === "volume") {
        	//s.volume = val/100;
        	change_volume(id,val/100);
        	$(value).html("volume:"+val);
			//console.log("changing vol: " + val);
        	changingVol = true;
        	// Set visual glow of volume
        	volumeGlow(val,$(this).parent().siblings(".turntable"));
        } else if (name === "pbr") {
        	change_speed(id,val/50);
        	changingPBR = true;
        	//s.playbackRate = val/50;
        } else if (name === "playback") {
        	//s.currentTime = (ss.duration*val/100);					
        	change_time(id, duration*val/100);
        	$(value).html("position:"+duration*val/100);
        }
	}
    $(control).mousemove(function() {
        if (controlChanging) {
            updateControls();
        }
    });
	
    $(control).mousedown(function() {
        controlChanging = true;
				updateControls();

    });
    $(control).mouseup(function() {
			controlChanging = false;
			updateControls();
		});
    $(document).mouseup(function(event) {
        controlChanging = false;
        changingVol = changingPBR = false;	
    });
		
	if (ctrls[tid] === undefined) {
		ctrls[tid] = {};
	}
	if (name === 'volume') {
		$(control).data('changeSlider', changeSlider);
		$(control).data('val', $(control));
		$(control).data('val2', $(value));
		ctrls[tid]['vol'] = $(control);
	} 
	if (name === 'pbr') {
		$(control).data('changeSlider', changeSlider);
		$(control).data('val', $(control));
		$(control).data('val2', $(value));
		ctrls[tid]['pbr'] = $(control);
	}
	if (name === 'playback') {
		$(control).data('changeSlider', changeSlider);
		$(control).data('val', $(control));
		$(control).data('val2', $(value));
		ctrls[tid]['pb'] = $(control);
	}
	
    if (name === 'playback') {
        $(value).html("0:00");
        $(control).val(0);
    }

    $(palette).append(control, label);
    
    if (showValue === 'true') {
        $(palette).append(value);
        console.log("val")
    }
	$(palette).attr('id',tid);
    return $(palette);
}

// SET & TRACK PICKING UI

function makePicker(sets) {
    var picker = $("section.picker");
    for (var i = 0; i < sets.length; i++) {

        var set        = sets[i].tracks,
            section    = $("<section>").addClass("set"),
            ul         = $("<ul>").addClass("tracks"),
            h1         = $("<h1>").html(sets[i].name)
            // playButton = $("<input>").attr({
            //     type: "button",
            //     class: "play-set",
            //     value: "Play this set"
            // })
            section.append(h1, ul);
           
        for (var j = 0; j < set.length; j++) {
            var track = set[j],
                li    = $("<li>").addClass("track"),
                title = $("<h1>").html(set[j].song).addClass("title"),
                author = $("<author>").html(set[j].artist).addClass("author");
				li.append(author, title);
				li.attr("trackid", set[j].id);
				//console.log("LI ID IS ", li.attr("trackid"));
				$(li).click(function() {
					tracks[$(this).attr("trackid")] = alltracks[$(this).attr("trackid")];
					socket.emit("newtrack", $(this).attr("trackid"));
					socket.emit("tracklist", tracks);
				});
            ul.append(li);
        }
        section.append(h1, ul);
        picker.append(section);
    }
    picker.css({
        width: sets.length * 25 + "%"
    });
}