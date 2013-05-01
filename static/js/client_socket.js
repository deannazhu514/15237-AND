var socket;
var auto_sort_flag = true;
var loop_flag = false;
var playback_device = true;
var nonstream = false;
var actual_vol = 0;
var trackList = {};
var username;
var noadd = false;


//rather than the server just sending a single
//attribute to change, we send the
//entire audio object with its attributes.
//That way if an update was lost
//we don't have to worry about cascading inconsistencies. 

function client_socket_init() {
	socket = io.connect("http://128.237.183.0:8111");

	socket.on("update_time", function(value, id) {
		value = Math.floor(value);
		for (key in sounds) {
			var tt = sounds[key];
			if (id == key) {
				console.log("changing time to", value);
				if (context !== undefined) {
					tt.source.mediaElement.currentTime = value;
					tt.play();
				}
				else {
					console.log(tt.position);
					tt.setPosition(value*1000);
				}
			}
		}
	});
	
	socket.on("update_volume", function(value, id) {
		value = Math.floor(value*100);
		for (key in sounds) {
			var tt = sounds[key];
			if (id == key) {
				console.log("change volume", value);
				if (context !== undefined)
					tt.source.mediaElement.volume = value;
				else {
					console.log(tt.volume);
					tt = tt.setVolume(value);
				}
			}
		}
	});

	socket.on("update", function(a) {
		if (!nonstream) {
			supdate(a);
		} else {
			nupdate(a);
		}
	});
	
	socket.on("getmod", function(track, num) {
		console.log("REC MODULE");
		if (true) {
			track.id = parseFloat(track.id);
			console.log(track.id);
			makePalette(track);
			trackList[track] = {
							playing: false,
							pbr: 1.0,
							volume: 1.0,
							time: 0,
							setTime: false
						};
		}
	});
	socket.on("disp_globals", function() {
		noadd = true;
		makeGlobalControls();
		$("section.picker").removeClass("open");
		console.log("making global controls!");
	});
	socket.on("remove_track", function() {
		$("body > ul#tracks .track").remove();
	});

	socket.on('add_track', function(track) {
		console.log('adding track ', track);
		if (typeof(track.id) === 'string') {
			track.id = parseFloat(track.id);
		}
		var elt = makePalette(track);
		console.log(trackList[track.id].playing);
		if (sounds[track.id] !== undefined) {
			if (context !== undefined && !sounds[track.id].source.mediaElement.paused) {
				elt.toggleClass("playing", true);
			} else if (!sounds[track.id].paused) {
				elt.toggleClass("playing", true);
			}
		}
			if (context !== undefined) {
				if (!sounds[track.id].source.mediaElement.paused) {
					elt.toggleClass("playing", true);
				}
			} else {				
				SC.stream('/tracks/'+track.id, 
					{autoLoad: true}, 
					function(sound) {
						console.log("streaming", track.id, sound);
						sounds[track.id] = sound;
						sound.setVolume(2);
						sound.play({
							onfinish: function() {
								console.log("done");
								sound.stop();
								elt.toggleClass("playing", true);
								
								if (autoPlay) {
									socket.emit('next', track.id);	
									
									$('#'+track.id).remove();
								} else {
									if (track.playing) {
										socket.emit('pause',track.id);
										$('#'+track.id).removeClass("playing");
									} else {
										console.log("was paused");
									}
								}
							}
						});
					});
			}
	});
	socket.on("requestInit", function() {
		var h = window.innerHeight;
		var w = window.innerWidth;
		console.log("platforrrm", platform);
		socket.emit("subscribe", username, h, w, platform);
		for (key in tracks) {
			socket.emit("newtrack", tracks[key].id);			
		}
		console.log(username, h,w);
	});

	socket.on("playback", function() {
		if (!nonstream) {
			playback_device = true;
			console.log('playback true');
		}
	});	

	socket.on("send_tracks", function() {
		send_tracks();
	});
	

}
function nupdate(a){
	console.log("nupdate");
	for (key in a) {
		audio = a[key];
		if (trackList[key] != undefined) {
			trackList[key].playing = audio.play;
			trackList[key].volume = audio.volume;
			trackList[key].pbr = audio.speed;
			if (!changingVol) {
				var tempobj = ctrls[key]['vol'];
				var tempfnc = tempobj.data('changeSlider');
				var val = tempobj.data('val');
				var val2 = tempobj.data('val2');
				tempfnc(val, val2, audio.volume);
			}
		}
	}
}

function addToCurrPlaying(pid,tid) {
	socket.emit("addToPlaying", pid, tid);
}

function supdate(a) {
	for (key in sounds) {
		if (a[key] == undefined) {
			sounds[key].stop();
			continue;
		}
		
		audio = a[key];
		var ctrl = ctrls[key];
		var track = trackList[key];
		var tt = sounds[key];
		if (audio !== undefined && ctrl != undefined && track != undefined) {
			if (context !== undefined) {
				var s = tt.source.mediaElement;
				actual_vol = (changingVol & !audio.fading) ? audio.volume : audio.fade;
		
				if (playback_device) {
					
					s.volume = actual_vol;
				} else {
					s.volume = 0;
				}
				
				s.playbackRate = audio.speed;
				
				track.playing = audio.play;
				track.volume =  actual_vol;
				track.pbr = audio.speed;
				if (s.ended) {
					tt.stop();
					if (autoPlay) {
						if (track.playing) {
							console.log("hmm");
						} else {
							console.log("autoplay was paused");
							s.currentTime = 0;
						}
						socket.emit('next', key);	

						$('#'+key).remove();		
						if ($('#tracks').children().length == 0) {
							$("section.picker").toggleClass("open");
							$("input.picker").removeClass("on");
						}						
					} else {
						if (track.playing) {
							socket.emit('pause',key);
							$('#'+key).removeClass("playing");
						} else {
							console.log("was paused");
							s.currentTime = 0;
						}
					}
				} else if (track.playing && s.paused) {
					tt.togglePause();
				} else if (!track.playing && !s.paused){
					tt.togglePause();
				} else {
					console.log(key, track.playing, s.paused);
				}
			} else {
				actual_vol = (changingVol) ? audio.volume : audio.fade;
				track.playing = audio.play; //true when play, false when pause
				track.volume = actual_vol;
				track.pbr = audio.speed;
				tt.playbackRate = audio.speed;
				tt.setVolume(Math.floor(audio.volume*100)); //soundcloud sound object is out of 100, not 1
				
				if (track.playing && tt.paused) {
					tt.togglePause();
				} else if (!track.playing && !tt.paused){
					tt.togglePause();
				}
			}
		} 
	}
	
	$(".turntable").each(function () {
		if (trackList[$(this).attr('id')].playing) {
			$(this).toggleClass('playing', true);
		} else {
			$(this).toggleClass('playing', false);
		}
	});
}

function sups (){
	$(".track").remove();
}

function togglePlayback() {
	playback_device = !playback_device;
}


function send_tracks() {
	socket.emit('tracklist', tracks);
}

function change_volume(id, value) {
	socket.emit("volume", id, value);
}

function change_speed(id, value) {
	socket.emit("speed", id, value);
}

function change_time(id, value) {
	socket.emit("change_time", id, value);
}

function fade_track(id, value) {
	socket.emit("fade", id, value);
}
