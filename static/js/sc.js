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
				console.log(me);
				//send user info to server + session ID
				$.ajax({
				  type: "post",
				  data: {"user": SCuser.id},
				  url: "/login",
				  success: function(data) { 
						
					}
				});
				location.href = "loggedin.html"; 
				loggedin = true;
			}				
	  });
	});
}

function getPlaylists(SCuser){
	 SC.get('/users/'+SCuser+'/playlists', function(playlists){	 
		playlists.forEach(function(playlist){
			var tracks = [];
			if (playlist.tracks != null) {
				for (var i = 0; i < playlist.tracks.length; i++) {
					tracks.push(playlist.tracks[i]);
				}
				SCplaylists[playlist.id] = tracks;
			}			
		});
	 });
}

