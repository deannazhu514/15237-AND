var current; //currentSound id
var currentSound;
var currentID;
var loggedin;
var ready = false;
var slider = {
                "type" : "slider",
                "orientation" : "horizontal",
                "showValue" : true
            };

function connect(){	

	 SC.initialize({
		client_id: '3d503a64aaf395aac54de428f7808b82',
		redirect_uri: 'http://localhost:8999/static/callback.html'
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
}

function init() {
	if (true){
		//getCurrentSong(localStorage["user"]);
		//current = localStorage["current"];
				
		SC.stream('/tracks/'+'69175111', function(sound){
			console.log("playinggg", sound);
			currentSound = sound;
			currentID = '69175111';
			if (currentSound.isHTML5) {
				console.log("lala");
			}
		});
	}
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
			var tracks = [];
			if (playlist.tracks != null) {
				for (var i = 0; i < playlist.tracks.length; i++) {
					var track = playlist.tracks[i];
					var track2 = {
						"id": track.id,
						"artist":track.user.full_name,
						"song": track.title,
						"ui": [{
								"type": "turntable",
								"art": track.artwork_url,
								"duration": track.duration
								}, slider, slider]
					};
					addTrack(SCuser, track2);
					makePalette(track2);					
				}
			$('.turntable').click(function(){
			console.log('hi');
			if (currentSound) {
				var tempid = this.id;
				var ttable = this;
				if (tempid != currentID) {
					SC.stream('/tracks/'+this.id, function(sound) {
						currentSound = sound;
						currentID = tempid;
						console.log(currentID);
						$(ttable).toggleClass("playing");
						currentSound.togglePause();
					});
				} else {
					currentSound.togglePause();
					$(this).toggleClass("playing");
				}
			}
		}); /*
			$('.track').mousedown(function(){
			console.log("lalal");
			if (currentSound) {
				currentSound.togglePause();	
				console.log('afdsjkf');
				$(this).toggleClass("playing");
			} else {
				console.log('sup');
				init();
			} 
		});*/
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
			console.log("current", data);
		}
	});
}

	$(document).ready(function() {
		SC.stream("/tracks/69175111", function(sound){
			currentSound = sound;
		});
		init();
	});
