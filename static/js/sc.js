var current; //currentSound id
var currentSound;
var currentID;
var loggedin = false;
var playlists = {};
var tracks = {};
var sounds = {};
var context, analyser, compressor;
var deviceNum;

//when true, will cause all tracks in playlist to play automatically
var autoPlay  = true; 

var client_id = '3d503a64aaf395aac54de428f7808b82';

var redirect_uri = 'http://localhost:8999/static/callback.html';
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
				console.log("calling event handlers init");
				eventHandlersInit();
				$("#loginbut").remove();
				$('form').remove();
				init();
			} else {
				alert("Couldn't connect to SoundCloud!");
			}
	  });
	});
}

function eventHandlersInit() {
	for (key in sounds) {
		var foo = function() {
			window.console.log("gr");
		}
		var aud = sounds[key].source.mediaElement;
		console.log(aud);
					aud.addEventListener('play',foo);
					console.log('hi');
					aud.addEventListener('ended', foo);
				aud.addEventListener('volumechange', function() {
					window.console.log("afdk;lsjlhewa");
				});
	}
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
			//tracks = {};
			if (playlist.tracks != null) {
				for (var i = 0; i < playlist.tracks.length; i++) {
					var track = playlist.tracks[i];
					var artwork = (track.artwork_url) ? track.artwork_url
					                                  : "http://placekitten.com/250"

					var duration = Math.floor(track.duration/1000);								  
					var track2 = {
						"id": track.id,
						"artist": track.user.username,
						"song": track.title,
						"url" : track.stream_url,
						"ui": [{
								"type": "turntable",
								"art": artwork,
								"duration": duration //DOES THE SONG COMPLETELY LOAD BEFORE WE ACCESS DURATION?
																					 //OTHERWISE WE SHOULD USE ESTIMATEDDURATION
																					 //BECAUSE IT ONLY GIVES LENGTH OF WHAT IS CURRENTLYLOADED
								}, volslider, pbslider, playbackslider],
						"i": i
					};
					
					var ss = {};
					var aud = new Audio(); 
					aud.src = track2.url+stream_add;
					aud.loop = false;
					aud.autoPlay = false;

					aud.onended = function(e) {
						console.log("finished playing");
						$(ttable).removeClass("playing");
						ss.stop();
					}
					
					aud.onpause = function(e) {
						console.log("pause");
					}
					var foo = function() {
						window.console.log("gr");
					}
					/*
					aud.addEventListener('play',foo);
					console.log('hi');
					aud.addEventListener('ended', foo);
				aud.addEventListener('volumechange', function() {
					window.console.log("afdk;lsjlhewa");
				});
				aud.addEventListener("canplay", function() {
					alert("z");
				});*/
					var source = context.createMediaElementSource(aud);	
					console.log(source);

					var source = context.createMediaElementSource(aud);	
				
					ss.source = source;
					ss.play = play;
					ss.togglePause = togglePause;
					ss.stop = stop;	
					sounds[track2.id] = ss;
					tracks[track.id] = track2;
					addTrack(SCuser, track2);		
				}
			}
								
			socket.emit('tracklist', tracks);
			var temp = {};
			temp.name = playlist.title;
			temp.length = playlist.tracks.length;
			temp.tracks = tracks;
			playlists[playlist.id] = temp;

		});
		socket.emit('playlists', playlists);
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

function addControl(){

}
