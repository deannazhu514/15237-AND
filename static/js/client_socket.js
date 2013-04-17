
var socket = io.connect("http://localhost:8111");

var auto_sort_flag = true;
var loop_flag = false;
var playback_device = false;
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


socket.on("update", function(audio) {
	for (key in sounds) {
		var tt = sounds[key];
	
		actual_vol = audio.volume;
		if (playback_device) {
			tt.setVolume(audio.volume);
		} else {
			tt.setVolume(0);
		}
		console.log("audio vol : " + audio.volume);
		if (!changingVol) {
			var tempfnc = ctrls[key].data('changeSlider');
			var val = ctrls[key].data('val');
			var val2 = ctrls[key].data('val2');
			tempfnc(val, val2, audio.volume);
			console.log(changingVol);
		}
		if (sounds[key].playing && sounds[key].paused) {
			sounds[key].play();
			alert('hi');
		} else if (!sounds[key].playing && !sounds[key].paused){
			sounds[key].pause();
			alert('sp');
		}
	}
}); 



socket.on("requestUsername", function() {
	socket.emit("subscribe", username);
});

socket.on("playback", function() {
	playback_device = true;
	console.log('playback true');
});	


function change_volume(value) {
	console.log(value);
  socket.emit("volume", value);
}
/*
function change_speed(value) {
  socket.emit("speed", value);
}

function mute() {
  socket.emit("mute");
}

function unmute() {
  socket.emit("unmute");
}*/