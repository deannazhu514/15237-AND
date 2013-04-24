

String.prototype.hashCode = function(){
    var hash = 0, i, char;
    if (this.length == 0) return hash;
    for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

function newRoom() {
  var value = "";
  $.ajax({
    type: "get",
    url: "newRoom/"+username,
    success: function(data) {
      return data.url;
    }
  });
}

		//var username = "s is awesome";
		var draw_qrcode = function(text, typeNumber, errorCorrectLevel) {
			document.write(create_qrcode(text, typeNumber, errorCorrectLevel) );
		};

		var create_qrcode = function(text, typeNumber, errorCorrectLevel, table) {
			var qr = qrcode(typeNumber || 4, errorCorrectLevel || 'M');
			qr.addData(text);
			qr.make();
			return qr.createImgTag();
		};

		var update_qrcode = function() {
			var qrtext = username.hashCode();
      console.log(qrtext);
			document.getElementById('qr-text').innerHTML = qrtext
			document.getElementById('qr').innerHTML = create_qrcode(qrtext);
      var image = $("img")[0];
      
		};