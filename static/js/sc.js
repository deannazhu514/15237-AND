var current; //currentSound id
var currentSound;
var currentID;
var loggedin;
var ready = false;
var sounds = {};
var slider = {
                "type" : "slider",
                "orientation" : "horizontal",
                "showValue" : true
            };

function connect(){	

	 SC.initialize({
		client_id: '3d503a64aaf395aac54de428f7808b82',
		redirect_uri: 'http://128.237.249.225:8999/static/callback.html'

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

				for (var i = 0; i < data.length; i++) {
					console.log("making paletta");
					makePalette(data[i]);
				}
				
				ready = true;

				$("#loginbut").remove();
			} else {
				alert("Couldn't connect to SoundCloud!");
			}			
	  });
	});
	//init();
}
/*
function init() {
	if (localStorage["current"] == undefined){	
		localStorage["current"] = '2345435';
	}
	getCurrentSong(localStorage["user"]);
	current = localStorage["current"];
	SC.stream('/tracks/'+current, function(sound){
		console.log("playinggg", sound);
		currentSound = sound;
		if (currentSound.isHTML5) {
			console.log("lala");
		}
	});
}
*/
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
			var tracks = [];
			if (playlist.tracks != null) {
				for (var i = 0; i < playlist.tracks.length; i++) {
					var track = playlist.tracks[i];
					var artwork = (track.artwork_url) ? track.artwork_url
					                                  : "http://placekitten.com/250"

					var track2 = {
						"id": track.id,
						"artist": track.user.username,
						"song": track.title,
						"ui": [{
								"type": "turntable",
								"art": artwork,
								"duration": track.duration
								}, slider, slider]
					};
					addTrack(SCuser, track2);
					makePalette(track2);					
				}
				$('.turntable').click(function(){
						var tempid = this.id;
						var ttable = this;
						if (sounds[tempid] == undefined) {
							SC.stream('/tracks/'+this.id, function(sound) {
								console.log(sound);
								sounds[tempid] = sound;
								sound.play();
								$(ttable).toggleClass("playing");
							});
						} else {
							sounds[tempid].togglePause();
							$(this).toggleClass("playing");
						}
				}); 
			}
		});
	 });
	 loggedin = true;
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

