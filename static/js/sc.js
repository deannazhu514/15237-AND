var SCuser;
var currentSound;
var loggedin;
SCplaylists = {};

function connect(){
	 SC.initialize({
		client_id: '3d503a64aaf395aac54de428f7808b82',
		redirect_uri: 'http://localhost:8999/static/callback.html'
	});
	
	 SC.connect(function() {
		SC.get('/me', function(me) { 			
			if (me != null) {
				SCuser = me;
				//send user info to server + session ID
				loginUser(me);
				loggedin = true;
				$("#loginmsg").html("Logged in as "+me.full_name);
				$("#loginbut").remove();
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
		}
	});
}

function getPlaylists(SCuser){
	 SC.get('/users/'+SCuser+'/playlists', function(playlists){	 
		playlists.forEach(function(playlist){
			var tracks = [];
			if (playlist.tracks != null) {
				for (var i = 0; i < playlist.tracks.length; i++) {
					tracks.push(playlist.tracks[i]);
					console.log(playlist.tracks[i]);
					
				}
				SCplaylists[playlist.id] = tracks;
			}			
		});
	 });
}

function addTrack(){
}
