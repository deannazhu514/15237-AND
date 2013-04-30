var ctrls = {};
var controlChanging = false;
var changingVol = false;
var changingPBR = false;
var changingPB = false;
var fading = false;
var intids = {};
var setlist = [];

var colors = ["red","orange","yellow"]

var slider = {
    "type" : "slider",
    "orientation" : "horizontal",
    "showValue" : true
};

makeGlobalControls();

//source code: http://www.hardcode.nl/subcategory_1/article_414-copy-or-clone-javascript-array-object

function cloneObject(source) {
    for (i in source) {
        if (typeof source[i] == 'source') {
            this[i] = new cloneObject(source[i]);
        } else {
            this[i] = source[i];
        }
    }
}

function constructSetList(playlists) {
    for (key in playlists) {
        console.log("KEY IS : " +key);
        var temptracks = $.map(playlists[key].tracks, function (value, key) { return value; });
        //sort temptracks
        var i = 0;
        while (i < playlists[key].length) {
            if (temptracks[i].i != i) {
                var temp = new cloneObject(temptracks[i]);
                var tempind = 
                //console.log(temp);
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
        //console.log(temptracks);
        var tempobj = {name: playlists[key].name, id: key,
                                    tracks: temptracks};
        setlist.push(tempobj);
    }
    console.log("setlist", setlist);
}

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
    var track     = $("<li>").attr({
                        class: "track",
                        id:    template.id
                    }),
        header    = $("<header>"),
        title     = $("<h1>").html(template.song),
        artist    = $("<author>").html(template.artist),
        controls  = $("<ul>").addClass("controls"),
		removeBut = $("<input type=button>")
            		.addClass("removeBut")
            		.attr({id: template.id})
            		.val("Remove"),
        tid      = template.id;
		
	removeBut.click(function(){
		var id = this.getAttribute("id");
		
		$('#'+id).remove();
		socket.emit("deltrack", id);
		delete trackList[id];
		delete tracks[id];
		console.log(sounds[id]);
		sounds[id].stop();
		if ($('#tracks').children().length == 0) {
			$("section.picker").toggleClass("open");
			$("input.picker").removeClass("on");
		}
	});
		
    $(header).append(artist, title, removeBut);
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
            track.append(element, makeWaveform(alltracks[template.id]));
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

function makeWaveform(track) {
    var waveform = $("<div>").addClass("waveform").css({
        "-webkit-mask-box-image": "url("+track.waveform_url+")"
    });
    return waveform;
}

function makeTurntable2(artSrc, duration, tid) {
    var turntable = $("<div>").addClass("turntable"),
        scrubber  = $("<div>").addClass("scrubber"),
        // indicator1 = $("<div>").attr({
        //     class: "indicator semi",
        //     id: "indicator1"
        // }),
        // indicator2 = $("<div>").attr({
        //     class: "indicator semi",
        //     id: "indicator2"
        // }),
        // mask = $("<div>").addClass("mask semi"),
        art = $("<img>").attr({
            src:   artSrc,
            class: "art"
        }),
        canvas = $("<canvas>").attr({
            id: "progress",
            height: 500,
            width:  500
        });



    // $(scrubber).append(indicator1, indicator2, mask);
    $(scrubber).append(canvas);
    $(turntable).append(scrubber, art);
    $(turntable).attr('id',tid);

    $(turntable).click(function(){
        var tempid = tid;

        console.log("HEREEEEEEEEEEEEE");
        if (sounds[tempid] == undefined) {
            SC.stream('/tracks/'+tempid, function(sound) {
                sounds[tempid] = sound;
            });
            sounds[tempid].play();			
        }

        if (trackList[tempid].playing) {
            socket.emit('pause',tid);
            $(this).toggleClass("playing",false);
        } else {
            socket.emit('play',tid);
            $(this).toggleClass("playing",true);
        }

    }); 
    return $(turntable);

    $(turntable).attr('id',tid);
    drawProgress(canvas[0], 0);

    $(turntable).click(function(){
        var tempid = tid;

        if (trackList[tempid].playing) {
            socket.emit('pause',tid);
            $(this).toggleClass("playing",false);
            // kill glow
            volumeGlow(0,$(turntable));
        } else {
            socket.emit('play',tid);
            $(this).toggleClass("playing",true);
            // default glow when playing starts
            volumeGlow(50,$(turntable));
        }
    }); 
    return $(turntable);

}

// Called after volume change
function volumeGlow(vol, item) {
    var glow = vol * 2;
    $(item).css({
        "box-shadow": "0 0 " + glow + "px " + "red"
    })
}

function makeTurntable(artSrc, duration, tid) {
    var turntable = $("<div>").addClass("turntable"),
        scrubber  = $("<div>").addClass("scrubber"),
        // indicator1 = $("<div>").attr({
        //     class: "indicator semi",
        //     id: "indicator1"
        // }),
        // indicator2 = $("<div>").attr({
        //     class: "indicator semi",
        //     id: "indicator2"
        // }),
        // mask = $("<div>").addClass("mask semi"),
        art = $("<img>").attr({
            src:   artSrc,
            class: "art"
        }),
        canvas = $("<canvas>").attr({
            id: "progress",
            height: "100%",
            width: "100%"
        });

    // $(scrubber).append(indicator1, indicator2, mask);
    $(scrubber).append(canvas);
    $(turntable).append(scrubber, art);
    $(turntable).attr('id',tid);
    // var foo = canvas[0];
    // console.log("———————————————————————————")
    // console.log(foo)
    // console.log("———————————————————————————")
    drawProgress(canvas[0], 0);

    $(turntable).click(function(){
        var tempid = tid;
        var ttable = this;
        var cursound = sounds[tempid];    
        console.log(tempid);
        /*if (cursound === undefined && (!nonstream)) {
            console.log("hehehe");
            var sound = {};
            var audio = new Audio();
            audio.src = tracks[tempid].url+stream_add;
<<<<<<< HEAD
            
=======

>>>>>>> 4787d07788cdcc2dd5deba98fa7d9e347dbcab5a
            audio.addEventListener('ended', function() {
                console.log("finished playing");
                $(ttable).toggleClass("playing");
                sound.stop();
                if (autoplay) {
                    console.log("playing next track");
<<<<<<< HEAD
                    
=======

>>>>>>> 4787d07788cdcc2dd5deba98fa7d9e347dbcab5a
                } else {
                    console.log("stopped");
                }
            });
<<<<<<< HEAD
            
=======

>>>>>>> 4787d07788cdcc2dd5deba98fa7d9e347dbcab5a
            var source = context.createMediaElementSource(audio);    
            //console.log(source);
            sound.source = source;
            sound.play = play;
            sound.togglePause = togglePause;
            sound.stop = stop;    
            sounds[tempid] = sound;

<<<<<<< HEAD
<<<<<<< HEAD
	$(turntable).click(function(){
    	// default glow when playing starts
    	volumeGlow(50, turntable);
		var tempid = tid;
		var ttable = this;
		var cursound = sounds[tempid];	
		console.log("TID", tempid);
		
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
=======
    $(turntable).click(function(){
        // default glow when playing starts
        volumeGlow(50, turntable);
        var tempid = tid;
        var ttable = this;
        var cursound = sounds[tempid];	
        console.log("TID", tempid);

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
>>>>>>> 4787d07788cdcc2dd5deba98fa7d9e347dbcab5a
=======
            if(trackList[tempid].playing) {
                socket.emit('pause',tid);
            } else {
                socket.emit('play',tid);
            }
            console.log(trackList[tempid].playing);
            $(ttable).toggleClass("playing");            
<<<<<<< HEAD
            
=======

>>>>>>> 4787d07788cdcc2dd5deba98fa7d9e347dbcab5a
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
            // setInterval(function(){
            // }, 1000);

            if (sounds[tempid] == undefined) {
                /*SC.stream('/tracks/'+tempid, function(sound) {
                    sounds[tempid] = sound;
                    sound.play({
                        onfinish: function() {
                            sound.stop();
                            $(ttable).toggleClass("playing");	
                        }
                    });
                });*/
            }

            //console.log(trackList[tempid].playing);
            if(trackList[tempid].playing) {	
                volumeGlow(5, turntable);
                //sounds[tempid].togglePause();
                //console.log("fadersound", sounds[tempid]);
                socket.emit('pause',tid);
                $(this).toggleClass("playing", false);	
            } else {
                volumeGlow(50, turntable);
                if (context == undefined)
                    sounds[tempid].togglePause();

                socket.emit('play',tid);
                //console.log("playing");
                $(this).toggleClass("playing", true);	
            }
            //$(this).toggleClass("playing");	
        //}
    });
    //turntable();
    return $(turntable);
}

function drawProgress(canvas, position) {
    if (canvas.getContext) {
        var context = canvas.getContext("2d"),
            multiple = position * 2;
        canvas.width = canvas.width;
        context.strokeStyle = "white";
        context.lineWidth   = 25;
        context.beginPath();
        context.arc(50,50,50,0,multiple*Math.PI,false);
        context.stroke();
    }
}

function makeGlobalControls() {
    var controls = [{
        "type" : "slider",
        "name" : "Volume",
        "orientation" : "horizontal",
        "showValue" : false
    },
    {
        "type" : "slider",
        "name" : "Left/Right",
        "orientation" : "horizontal",
        "showValue" : false
    },
    {
        "type" : "slider",
        "name" : "Treble",
        "orientation" : "horizontal",
        "showValue" : false
    },
    {
        "type" : "slider",
        "name" : "Bass",
        "orientation" : "horizontal",
        "showValue" : false
    }];
    var globalControlsPalette = $("<section>").attr({
        class: "global-controls-palette track",
        id: "tracks"
    })
    for (var i = 0; i < controls.length; i++) {
        var control = makeControl(controls[i].type,
                                  controls[i].name,
                                  controls[i].orientation,
                                  controls[i].showValue);
        globalControlsPalette.append(control);
    }
    $("body").append(globalControlsPalette);
}

function makeControl(type, name, orientation, showValue, tid, duration) {
    var palette = $("<li>").addClass("palette " + name),
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
    var timer;
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
            //console.log("volume", val, sounds[id]);
            if (context == undefined)
                sounds[id].setVolume(parseInt(val));
            changingVol = true;
            // Set visual glow of volume
            volumeGlow(val,$(palette).parent().siblings(".turntable"));
        } else if (name === "pbr") {

            change_speed(id,Math.pow(1.01395, val-50));
            changingPBR = true;
        } else if (name === "playback") {
            var x = duration*val/100;
                min = Math.floor(x/60),
                sec = (Math.floor(x%60) < 10) ? "0" + Math.floor(x%60) : Math.floor(x%60),
                str = min + ":" + sec;
            $(value).html(str);
            //s.currentTime = (ss.duration*val/100);                    
            change_time(id, x);
            // console.log("——————————————————————");
            // console.log(val);
            // console.log("——————————————————————");
        } else if (name === "fader") {
            fading = true;
            //fade value is inversed so 1 corresponds to current,
            //0 corresponds to next track
            fade_track(id, (100-val)/100);
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
        changingVol = changingPBR = fading = false;    
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
        $(control).val(0);
        $(control).data('changeSlider', changeSlider);
        $(control).data('val', $(control));
        $(control).data('val2', $(value));
        ctrls[tid]['pb'] = $(control);
        timer = setInterval(function(){
            var x;
            if (context !== undefined)
                x = sounds[tid].source.mediaElement.currentTime;  
            else {
                //console.log("doing time thing", sounds);
                if (sounds[tid] != undefined)
                    x = sounds[tid].position/1000;
            }
                min = Math.floor(x/60),
                sec = (Math.floor(x%60) < 10) ? "0" + Math.floor(x%60) : Math.floor(x%60),
                str = min + ":" + sec;
            $(value).html(str);
            var prog = 1/(duration/x);
            var canvas = (palette).parent().siblings(".turntable").children().children("canvas")[0];
            drawProgress(canvas, prog);
            $(control).val(prog);
        }, 250);
    }
    if (name === 'fader') {
        $(control).data('changeSlider', changeSlider);
        $(control).data('val', $(control));
        $(control).data('val2', $(value));
        $(control).val(0);
        ctrls[tid]['fad'] = $(control);
    }

    $(palette).append(control, label);
    if (showValue)
         $(palette).append(value);
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
        var set     = sets[i].tracks,
            section = $("<section>").addClass("set"),
            ul      = $("<ul>").addClass("tracks"),
            h1      = $("<h1>").html(sets[i].name)
                        .attr("playlist", sets[i].id)
                        .click(function(){
                            var id = $(this).attr("playlist");

                            for (track in playlists[id].tracks) {
                                console.log("TRACK", track);
                                tracks[track.id] = alltracks[track.id];
                                socket.emit("newtrack", track);
                            }
                            $("#tracks").children().remove();
                            socket.emit("tracklist", playlists[id].tracks);
                        });
            // playButton = $("<input>").attr({
            //     type: "button",
            //     class: "play-set",
            //     value: "Play this set"
            // })
            section.append(h1, ul);
        for (var j = 0; j < set.length; j++) {
            var track = set[j],
                li     = $("<li>").addClass("track"),
                title  = $("<h1>").html(set[j].song).addClass("title"),
                author = $("<author>").html(set[j].artist).addClass("author");
                li.append(author, title);
                li.attr("trackid", set[j].id);
                //console.log("LI ID IS ", li.attr("trackid"));
                $(li).click(function() {
                    tracks[$(this).attr("trackid")] =
                       alltracks[$(this).attr("trackid")];
                    socket.emit("newtrack", $(this).attr("trackid"));
                    socket.emit("tracklist", tracks);
                    $(this).parents("section.picker").removeClass("open");
                });
            ul.append(li);
        }
        section.append(h1, ul);
        picker.append(section);
    }
    picker.css({
        width: Math.max(sets.length * 25, 100) + "%"
    });
}