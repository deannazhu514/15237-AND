var currentSound;
var SCuser;

function connect(){
	 SC.initialize({
		client_id: '3d503a64aaf395aac54de428f7808b82',
		redirect_uri: 'http://localhost:8080/callback.html'
	});
}
