var current; //currentSound id
var currentSound;
var currentID;
var loggedin = false;
var tracks = {};
var sounds = {};
var context, myAudioAnalyser;
var client_id = '3d503a64aaf395aac54de428f7808b82';
var redirect_uri = 'http://localhost:8999/static/callback.html';
var stream_add =  '?client_id='+client_id;

var volslider = {
                "type" : "slider",
				"name" : "volume",
                "orientation" : "horizontal",
                "showValue" : true
            };

var pbslider = {
                "type" : "slider",
				"name" : "playback",
                "orientation" : "horizontal",
                "showValue" : true
            };			
			
function init() {
	context = new webkitAudioContext();
/*   
    var source;
    // `stream_url` you'd get from 
    // requesting http://api.soundcloud.com/tracks/6981096.json
    var url = 'https://api.soundcloud.com/tracks/87076291/stream' +
          stream_add;

	audio.src = url;
	source = context.createMediaElementSource(audio);
	source.connect(context.destination);*/
//source.mediaElement.play();
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
				loginUser(me.id);
				localStorage["user"] = me.id;
				loggedin = true;
				$("#loginmsg").html("Logged in as "+me.full_name);
				getPlaylists(me.id);

				$("#loginbut").remove();
				init();
			} else {
				alert("Couldn't connect to SoundCloud!");
			}			
	  });
	});
}

function loginUser(userID){
	$.ajax({
		type: "post",
		data: {"user": userID, "date": new Date()},
		url: "/login",
		success: function(data) {
			console.log(data);
			localStorage["current"] = data;
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
								}, volslider, pbslider]
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

