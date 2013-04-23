var socket = io.connect("http://localhost:8111");
//var socket = io.connect("http://128.237.113.212:8111");

var auto_sort_flag = true;
var loop_flag = false;
var playback_device = false;
var nonstream = false;
var actual_vol = 0;
var trackList = {};

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
			tempfnc(val, val2, audio.volume*100);
		}
		if (!changingPBR) {
			var tempobj = ctrls[key]['pbr'];
			var tempfnc = tempobj.data('changeSlider');
			var val = tempobj.data('val');
			var val2 = tempobj.data('val2');
			tempfnc(val, val2, audio.speed*50);
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
		} else if (!trackList[key].playing && !s.paused){
			tt.togglePause();
		} else {
			
		}
		
	}
}



socket.on("requestUsername", function() {
	socket.emit("subscribe", username);
	console.log(username);
});

socket.on("playback", function() {
	playback_device = true;
	console.log('playback true');
});	

socket.on("getmod", function(track, num) {
	//if (deviceNum == num) {
	if (true) {
		nonstream = true;
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