var current; //currentSound id
var currentSound;
var loggedin = false;
var tracks = {};
var sounds = {};
var context, analyser, compressor;

var client_id = '3d503a64aaf395aac54de428f7808b82';

var redirect_uri = 'http://localhost:8999/static/callback.html';
//var redirect_uri = 'http://128.237.249.225:8999/static/callback.html';
var stream_add =  '?client_id='+client_id;


var volslider = {
                "type" : "slider",
				"name" : "volume",
                "orientation" : "horizontal",
                "showValue" : false
            };

var pbslider = {
                "type" : "slider",
				"name" : "pbr",
                "orientation" : "horizontal",
                "showValue" : false
            };	
			
var playbackslider = {
                "type" : "slider",
				"name" : "playback",
                "orientation" : "horizontal",
                "showValue" : true
            };			
			
function init() {
	context = new webkitAudioContext();
	analyser = context.createAnalyser();
	compressor = context.createDynamicsCompressor();

}	
			
function connect(){	
	 SC.initialize({
		client_id: client_id,
		redirect_uri: redirect_uri

	});
	
	 SC.connect(function() {
		SC.get('/me', function(me) { 			
			if (me != null) {
				//send user info to server
				var deviceID = new Date();
				loginUser(me.id, deviceID);
				localStorage["user"] = me.id;
				loggedin = true;
				$("#loginmsg").html("Logged in as "+me.full_name);
				getPlaylists(me.id);

				$("#loginbut").remove();
				$('form').remove();
				init();
			} else {
				alert("Couldn't connect to SoundCloud!");
			}			
	  });
	});
}

function connectDevice(){	
	var username = $("#username").val();
	var session = $("#session").val();
	var deviceID = new Date(); //CHANGE TO SOMETHING ELSE THAT MAKES SENSE HEHE
	if (username == "" || session == "") {
		alert("Please enter username and session code");
	} else {
		sendDevice(username, session, deviceID);
		localStorage["user"] = username;
		loggedin = true;

	}
}

function loginUser(userID, deviceID){
	$.ajax({
		type: "post",
		data: {"user": userID, "deviceID": deviceID},
		url: "/login",
		success: function(data) {
			console.log(data);
			localStorage["current"] = data;
			$('#usertext').html("Username: "+data.userID);
			$('#sessiontext').html("Session ID: "+data.session);
		}
	});
}

function sendDevice(userID, session, deviceID){
	$.ajax({
		type: "post",
		data: {"user": userID, "session": session, "deviceID": deviceID},
		url: "/login/"+userID,
		success: function(data) {
			console.log(data);
			if (!data.success) {
				$("#loginmsg").html("Device  not connected!");
			} else {
				console.log(data);
				$("#loginmsg").html("Device "+data.deviceNum+" connected!");			
				$("#loginbut").remove();
				$('form').remove(); 
			}
		}
	});
}

function getPlaylists(SCuser){
	 SC.get('/users/'+SCuser+'/playlists', function(playlists){	 
		playlists.forEach(function(playlist){
			//var tracks = {};
			if (playlist.tracks != null) {
				for (var i = 0; i < playlist.tracks.length; i++) {
					var track = playlist.tracks[i];
					var artwork = (track.artwork_url) ? track.artwork_url
					                                  : "http://placekitten.com/250"

					var track2 = {
						"id": track.id,
						"artist": track.user.username,
						"song": track.title,
						"url" : track.stream_url,
						"ui": [{
								"type": "turntable",
								"art": artwork,
								"duration": track.duration
								}, volslider, pbslider, playbackslider]
					};
					//console.log(track2);
					tracks[track.id] = track2;
					addTrack(SCuser, track2);
					makePalette(track2);					
				}
			}
			//playlists[playlist.id] = tracks;
		});
	 });
	 loggedin = true;
	 $("body").removeClass("guest");
}

function play(){
	
	this.source.loop = true;
	this.source.mediaElement.play();
	this.playing = true;
}

function stop(){
	this.source.mediaElement.pause();
	this.playing = false;
};

function togglePause(){
	this.playing ? this.stop() : this.play();
};


function addTrack(userID, track){
	$.ajax({
		type: "post",
		data: {"user": userID, "track":track},
		url: "/tracks",
		success: function(data) { 
			console.log(data);
		}
	});
}


function getCurrentSong(userID){
	$.ajax({
		type: "get",
		data: {},
		url: "/current/"+userID,
		success: function(data) {
			localStorage["current"] = data.current.id;
		}
	});
}

