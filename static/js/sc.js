var current; //currentSound id
var currentSound;
var currentID;
var loggedin = false;
var playlists = {};
var tracks = {};
var alltracks = {};
var sounds = {};
var context, analyser, compressor;
var deviceNum;

//when true, will cause all tracks in playlist to play automatically
var autoPlay  = true;
//when true, will cause a playlist to loop around
var loop = true; 

var client_id = '3d503a64aaf395aac54de428f7808b82';

var redirect_uri = 'http://localhost:8999/static/index.html';
//var redirect_uri = 'http://128.237.113.212:8999/static/callback.html';

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
				username = me.id;
				//send user info to server
				var deviceID = new Date();
				currentID = me.id;
				loginUser(me.id, deviceID);
				localStorage["user"] = me.id;
				loggedin = true;
				$("#username").html(me.full_name);
				getPlaylists(me.id);
				client_socket_init();
				$("#loginbut").remove();
				$('form').remove();
				init();
				console.log("calling event handlers init");
			} else {
				alert("Couldn't connect to SoundCloud!");
			}
	  });
	});
}

/*function ended() {
	tt.stop();					
	if (track.playing) {
		socket.emit('pause',key);
		$('#'+key).removeClass("playing");
	} else {
		console.log("was paused");
		s.currentTime = 0;
	}
	if (autoPlay) {
				
	} else {
	}
}*/

function eventHandlersInit() {
	$(document).ready( function() {
		var foo = function() {
			window.console.log("gr");
		};
		
		//alert('a');
		for (key in sounds) {
			console.log("SOUND KEY IS : ", key);
			var aud = sounds[key].source.mediaElement;
				/*aud.addEventListener('ended', function () {
					sounds[key].stop();
					console.log("pause", sounds[key]);
					$('#'+key).removeClass("playing");
					socket.emit('pause', key);
				}, false);
				aud.addEventListener('play', function() {
					console.log("hehe");
					$('#'+key).addClass("playing");
				});
				aud.addEventListener('pause', function() {
					$('#'+key).removeClass("playing");
				});*/
		}
		window.console.log('aaaa');
	});
}

function connectDevice(){	
	//var username = $("#username").val();
	var session = $("input#username").val();
	var un = session;
	username = session;
	var deviceID = new Date(); //CHANGE TO SOMETHING ELSE THAT MAKES SENSE HEHE
	if (un == "" || session == "") {
		alert("Please enter username and session code");
	} else {
		sendDevice(un, session, deviceID);
		localStorage["user"] = un;
		currentID = un;
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
				nonstream = true;
				$("#loginbut").remove();
				$('form').remove(); 
				deviceNum = data.deviceNum;
				client_socket_init();
				
			}
		}
	});
}

function getDevices() {
	$.ajax({
		type: "get",
		data: {"user": currentID},
		url: "/devices/"+currentID,
		success: function(data) {
			var num = data.deviceNum;
			for (var i = 0; i < num; num++) {
				/*var button = $('<input>').html("Device"+(i+1));
				$('#devices').append(button);*/
				console.log("track"+i);
			}
		}
	});
}

function getModules(){
	console.log("getModules");
	for (track in tracks) {
		if (tracks[track]['appended'] == undefined) {
			//console.log(track);
			
			tracks[track]['appended'] = true;
			var trackbut = $('<input type=button>')
							.addClass("panel-button")
							.val(""+track+tracks[track].song);
			var bleh = function(t) {
				console.log('t: ' + t);
				sendModule2(2, "track", t);
			};
			var x = track;
			//console.log('x: ' + x);
			var blah = function() { bleh(x); };
			trackbut.mousedown( function(event) {
				console.log(this);
				console.log('sending module');
				sendModule2(2, 'track', parseFloat(this.value.substring(0, 8)));
			});
				//console.log(tracks[track].song);
			$('#modules').append(trackbut);
		}
	}
}

function sendModule2(device, module, modulename) {
	//socket.emit("sendModule", device, module, modulename);
	
	socket.emit("sendModule", tracks[modulename], device);
}

function sendModule(device, module, modulename) {
	$.ajax({
		type: "post",
		data: {"user": currentID,
				"device": device,
				"module": module,
				"name": modulename
		},
		url: "/sendModule",
		success: function(data) {
			console.log(data);
			
		}
	});
}


function getPlaylists(SCuser){
	username = SCuser;
	SC.get('/users/'+SCuser+'/playlists', function(lists){
		
		lists.forEach(function(playlist){
			tracks = {};
			var temp = {tracks: {}};
			if (playlist.tracks != null) {
				for (var i = 0; i < playlist.tracks.length; i++) {
					var track = playlist.tracks[i];
					var artwork = (track.artwork_url) ? track.artwork_url
					                                  : "http://placekitten.com/250"

					var duration = track.duration/1000;								  
					var track2 = {
						"id": track.id,
						"artist": track.user.username,
						"song": track.title,
						"url" : track.stream_url,
						"ui": [{
								"type": "turntable",
								"art": artwork,
								"duration": duration 
								}, volslider, pbslider, playbackslider],
						"i": i
					};
					
					var ss = {};
					var aud = new Audio(); 
					aud.src = track2.url+stream_add;
					aud.loop = false;
					aud.autoPlay = false;
					
					var source = context.createMediaElementSource(aud);	
					//console.log(source);

					//addAudio(SCuser, audio);
					ss.source = source;
					ss.play = play;
					ss.togglePause = togglePause;
					ss.stop = stop;	
					sounds[track2.id] = ss;
					tracks[track.id] = track2;
					temp.tracks[track.id] = track2;
					alltracks[track.id] = track2;
					addTrack(SCuser, track2);		
				}
			}
								
			//socket.emit('tracklist', tracks);
			//var temp = {};
			temp.name = playlist.title;
			temp.length = playlist.tracks.length;
			//temp.tracks = tracks;
			playlists[playlist.id] = temp;
			tracks = {};
		});
		constructSetList(playlists);
		makePicker(setlist);
	 });
	 
	 loggedin = true;
	 $("body").removeClass("guest");
}


function ended(id) {
	console.log("ended!", id);
	$('.turntable #'+id).removeClass("playing");
}


function play(){
	this.source.loop = false;
	this.source.mediaElement.play();
	this.playing = true;
}

function stop(){
	//console.log("pause");
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

function addAudio(userID, audio){
	$.ajax({
		type: "post",
		data: {"user": userID, "audio":audio},
		url: "/audio",
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

function addControl(){

}
