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
socket = io.connect("http://localhost:8111");
socket.on("update_time", function(value) {
	for (key in sounds) {
				var tt = sounds[key];
		var s = tt.source.mediaElement;
		s.currentTime = value;
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
	/*if (device === deviceNum) {
		if (module == 'track') {
			
		}
	} */
});
socket.on("remove_track", function() {
	$(".track").remove();
});

socket.on('add_track', function(track) {
	console.log('adding track ' + track);
	makePalette(track);
});
socket.on("requestInit", function() {
	var h = window.innerHeight;
	var w = window.innerWidth;
	socket.emit("subscribe", username, h, w);
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
	console.log(tracks);
	 for (key in tracks) {
		console.log("SOCKET");
		alert(key);
		socket.emit("newtrack", tracks[key].id);
	 }

}
function nupdate(a){
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

function supdate(a) {
	for (key in sounds) {
		audio = a[key];
		var tt = sounds[key];
		var s = tt.source.mediaElement;
		actual_vol = audio.volume;
		if (playback_device) {
			if (audio.volume > 1) {
				console.log(audio.volume);
			}
			s.volume = audio.volume;
		} else {
			s.volume = 0;
		}
		
		s.playbackRate = audio.speed;
		if (!changingVol) {
			var tempobj = ctrls[key]['vol'];
			var tempfnc = tempobj.data('changeSlider');
			var val = tempobj.data('val');
			var val2 = tempobj.data('val2');
			if (tempfnc != undefined) {
				tempfnc(val, val2, audio.volume*100);
			}
		}
		if (!changingPBR) {
			var tempobj = ctrls[key]['pbr'];
			var tempfnc = tempobj.data('changeSlider');
			var val = tempobj.data('val');
			var val2 = tempobj.data('val2');
			if (typeof(tempfnc) != 'undefined');
			 {
			 //tempfnc(val, val2, audio.speed*50);
			 }
		} /*if (!changingPB) {
			var tempobj = ctrls[key]['pb'];
			var tempfnc = tempobj.data('changeSlider');
			var val = tempobj.data('val');
			var val2 = tempobj.data('val2');
			tempfnc(val, val2, audio.speed);
		}*/
		trackList[key].playing = audio.play;
		trackList[key].volume = audio.volume;
		trackList[key].pbr = audio.speed;
		if (trackList[key].playing && s.paused) {
			tt.togglePause();
			console.log('playing');
		} else if (!trackList[key].playing && !s.paused){
			tt.togglePause();
			console.log('paused');
		} else {
			
		}
		
	}
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
	console.log('change volume');
	console.log(typeof(id));
	console.log(typeof(value));
}

function change_speed(id, value) {
  socket.emit("speed", id, value);
}

function change_time(value) {
	socket.emit("change_time", value);
}