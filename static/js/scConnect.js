$(document).ready(function() {
	SC.initialize({
	    client_id: '3d503a64aaf395aac54de428f7808b82',
	    redirect_uri: 'http://localhost:8998/static/callback.html'
	});
	

	$('#connect').click(function(){
	    SC.connect(function() {
	        SC.get('/me', function(data) {
	            $('#name').text(data.username);
	        });
	    });
	    
	});
	 
	 $('#play').click(function(){
	    currentSound.togglePause();		  
	});
});
