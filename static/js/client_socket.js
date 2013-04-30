var socket;// = io.connect("http://localhost:8111");
//var socket = io.connect("http://128.237.113.212:8111");

var auto_sort_flag = true;
var loop_flag = false;
var playback_device = false;
var nonstream = false;
var actual_vol = 0;
var trackList = {};
var username;


//rather than the server just sending a single
//attribute to change, we send the
//entire audio object with its attributes.
//That way if an update was lost
//we don't have to worry about cascading inconsistencies. 

//POSSIBILITY: time stamp updates so that
//if we have duplicate controls, we don't override
//more recent updates that haven't been broadcasted
//yet. However, this isn't necessary
//since theoretically the new update will come not long
//after and override the older inconsistency soon enough. 
/*
//since sockets use tcp we can ensure no misordering of packets
socket.on("update", function(audio) {
  //var song = $("#song");
  var song = document.getElementById("song");
  var song_name = $("#song_name");
	console.log(song_name.html());
  if (song_name.html() !== audio.name) {
    //grab the appropriate song from soundcloud
    //create new audio dom obj here
    song = song; //update var
    song.load();
  }
  song.volume = audio.volume;
  song.playbackRate = audio.speed;
  //console.log(song.paused);
  if (audio.play) {
    if (song.paused) {
      song.play();
    }
  } else if (!song.paused) {
    song.pause();
  }
  auto_sort_flag = audio.auto;
  loop_flag = audio.loop;
  //not the best way to do it, but ehhh
  if (Math.abs(song.currentTime - audio.time) > 1) {
    song.currentTime = audio.time;
  }
}); */

function client_socket_init() {
	//socket = io.connect("http://localhost:8111");
	socket = io.connect("http://128.237.186.94:8111");


	socket.on("update_time", function(value, id) {
		value = Math.floor(value);
		for (key in sounds) {
			var tt = sounds[key];
			if (id == key) {
				console.log("change time", value);
				if (context !== undefined)
					tt.source.mediaElement.currentTime = value;
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
		//if (deviceNum == num) {
		if (true) {
			//nonstream = true;
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
			//console.log(trackList[track.id].playing);
			if (context !== undefined) {
				if (!sounds[track.id].source.mediaElement.paused) {
					elt.toggleClass("playing", true);
					console.log('hidfdfd');
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
										//s.currentTime = 0;
									}
								}
							}
						});
					});
			
				/*if (sounds[track.id].paused){
					elt.toggleClass("playing", true);
					console.log('hidfdfd');
				}*/
			}
/*} else {
			console.log($('#'+track.id));
		}*/
		//console.log(elt);
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
		//socket.emit('playlists', playlists);
		//eventHandlersInit();
		$(document).ready(function(){
			// constructSetList(playlists);
		});
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
			console.log("lalal", trackList[key].playing);
		}
	}
}

function addToCurrPlaying(pid,tid) {
	socket.emit("addToPlaying", pid, tid);
}

function supdate(a) {
	//console.log("supdate");
	for (key in sounds) {
		if (a[key] == undefined) {
			//console.log("no key for", key);
			continue;
		}
		
		console.log(a[key]);
		audio = a[key];
		var ctrl = ctrls[key];
		var track = trackList[key];
		var tt = sounds[key];
		if (audio !== undefined && ctrl != undefined && track != undefined) {
			if (context !== undefined) {
				var s = tt.source.mediaElement;
				//console.log(tt.source);
				actual_vol = (changingVol & !audio.fading) ? audio.volume : audio.fade;
		
				if (playback_device) {
					if (audio.volume > 1) {
						console.log(audio.volume);
					}
					s.volume = actual_vol;
				} else {
					s.volume = 0;
				}
				
				s.playbackRate = audio.speed;
				
				track.playing = audio.play;
				track.volume =  actual_vol;
				//console.log(fading, track.volume);
				track.pbr = audio.speed;
				if (s.ended) {
					tt.stop();
					if (autoPlay) {
						if (track.playing) {
							console.log("hmm");
						} else {
							console.log("was paused");
							s.currentTime = 0;
						}
						socket.emit('next', key);	

						$('#'+key).remove();						
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
				}
			} else {
				actual_vol = (changingVol) ? audio.volume : audio.fade;
				//if (changingVol)
					//console.log(track, tt);
				//console.log(audio, tt);
				track.playing = audio.play; //true when play, false when pause
				track.volume = actual_vol;
				track.pbr = audio.speed;
				tt.playbackRate = audio.speed;
				tt.setVolume(Math.floor(audio.volume*100)); //soundcloud sound object is out of 100, not 1
				//console.log("clientsound", tt.paused, track.playing);
				//sounds[key].play();
				if (track.playing && tt.paused) {
					tt.togglePause();
					//console.log("toggle!", tt);
				} else if (!track.playing && !tt.paused){
					tt.togglePause();
					//console.log("toggle2!", tt);
				}
				//console.log("stuff", actual_vol, track.playing, tt);
			}
		} else {
			//console.log(ctrl, track, tt);
		}
	}
	
	$(".turntable").each(function () {
		if (trackList[$(this).attr('id')].playing) {
			$(this).toggleClass('playing', true);
		} else {
			$(this).toggleClass('playing', false);
		}
	});
	//socket.emit('tracklist', $.map(trackList, function (value, key) { return key; }));
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
	//console.log('change volume', id, value);
}

function change_speed(id, value) {
	console.log("SPEED VAL IS: ", value);
	socket.emit("speed", id, value);
  	//console.log('change speed', id, value);
}

function change_time(id, value) {
	socket.emit("change_time", id, value);
	
  	//console.log('change time', id, value);
}

function fade_track(id, value) {
	socket.emit("fade", id, value);
	console.log('fade track', id, value);
}
