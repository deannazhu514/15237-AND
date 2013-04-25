var express = require("express");



var app = express();
var mongo = require('mongodb');

var staticPort = 8999;
var mongoPort = 9000;

var users = {};

app.use(express.bodyParser());

/*BEGIN MONGO CODE*/
/*
var client = new mongo.Db("users", new mongo.Server('localhost', mongoPort, { w: 1}));

function openDb(onOpen){
    client.open(onDbReady);

    function onDbReady(error){
        if (error)
            throw error;
        client.collection('users', onTestCollectionReady);
    }

    function onTestCollectionReady(error, collection){
        if (error)
            throw error;

        onOpen(collection);
    }
}

function closeDb(){
    client.close();
}

openDb(onDbOpen);
*/
/*END MONGO CODE*/

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

app.get("/static/:staticFilename", function (request, response) {
  /*
  console.log(request.params.staticFilename);
  var reqstr = request.params.staticFilename;
  //var index = reqstr.lastIndexOf('/');
  var name = request.params.staticFilename;
  var path = request.params.path;
  console.log(path + name);
  response.sendfile(path + "/" +name);
  */
  response.sendfile("static/" + request.params.staticFilename);
});



app.get("/static/css/:staticFilename", function (req, res) {
  res.sendfile("static/css/" + req.params.staticFilename);
});


app.get("/static/js/lib/:staticFilename", function (req, res) {
  res.sendfile("static/js/lib/" + req.params.staticFilename);
});

app.get("/static/js/lib/jsqrcode/:staticFilename", function (req, res) {
  res.sendfile("static/js/lib/jsqrcode/" + req.params.staticFilename);
});

app.get("/static/js/:staticFilename", function (req, res) {
  res.sendfile("static/js/" + req.params.staticFilename);
});

//implement authentication later
app.get("/login/:id", function(request, response) {
	var id = request.params.id;
	var user = users[id];
	response.send({
		user: user,
		success:true
	});
});

app.get("/devices/:id", function(request, response) {
	var id = request.params.id;
	var deviceNum = users[id].deviceCount;
	response.send({
		deviceNum: deviceNum,
		success:true
	});
});

app.get("/sessionCode/:id", function(request, response) {
	var id = request.params.id;
	var session = users[id].session;
	response.send({
		userID : id,
		session: session,
		success:true
	});
	
});

//login via SoundCloud
app.post("/login", function(request, response) {
	//console.log(request.body);
	var id = request.body.user;
	var deviceID = request.body.deviceID;
	var num = "";
	if (users[id] == undefined) {
		users[id] = {};
		users[id].devices = {};
		users[id].deviceCount = 1;
		users[id].devices[deviceID] = {
					"num" : users[id].deviceCount,
					"controls":[],
					"connected": true
		};
		console.log("user num: " + users[id].devices[deviceID].num);
		num =  users[id].devices[deviceID].num;
		users[id].session = id; //CHANGE THIS TO ACTUALLY UNIQUE LATER
	} else {
		
	}
	response.send({
		userID : id,
		deviceNum: num,
		session : users[id].session,
		success:true
	});
});

//login via device connect
app.post("/login/:id", function(request, response) {
	var id = request.params.id;
	var num = "";
	var session = request.body.session;
	var deviceID = request.body.deviceID;
	var success = (users[id] != undefined) && (session == users[id].session);
	if (success) {
		console.log("userr id: " + users[id]);
		users[id].deviceCount++;
		var deviceCount = users[id].deviceCount;
		users[id].devices[deviceCount] = {
				"id" : deviceID,
				"num" : deviceCount,
				"controls" : [],
				"connected" : true
		};	
		console.log("device: " + users[id].devices[deviceID]);
		num = users[id].devices[deviceCount].num;		
	}
	response.send({
		userID : id,
		deviceNum: num,
		success: success
	});
});

app.post("/sendModule", function(request, response) {
	var id = request.body.user;
	var device = request.body.device;
	var module = request.body.module;
	var moduleID = request.body.name;
	
	var success = (users[id] != undefined) && (users[id].devices[device] != undefined);
	if (success) {
		console.log("sending "+module+"to "+ device);
		
	}
	response.send({
		userID : id,
		success: success
	});
});



app.post("/tracks", function(request, response) {
	//console.log(request.body);
	var user = request.body.user;
	console.log(user);
	var track = request.body.track;
	if (users[user] == undefined) {
		users[user] = {};
	}
	if (users[user]["playlists"] == undefined) {
		users[user]["playlists"] = [];
		users[user]["current"] = track;
	}
	
	users[user]["playlists"].push(track);
		
	response.send({
		userID : user,
		success:true
	});  
});


app.get("/current/:id", function(request, response){
	var id = request.params.id;
	response.send({
		current: users[id]["current"]
	});
});

app.get("newRoom/:accountName", function(request, response) {
  var tempString = request.params.accoutName + (new Date())//.getTime());
  var urlHash = tempString.hashCode();
  response.send({
    url: urlHash
  });
});

app.get("/socket.io/:fileName", function (req, res) {
	console.log('hi');
	res.sendfile("node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.js");
});

app.get("/room/:roomString", function (request, response) {
	
});

app.listen(staticPort);

/* server variables*/
var io = require("socket.io").listen(8111);
io.set('log level', 1);
var ports = {};
//var minPort = 8000;
//var maxPort = 8998;
//var nextPort = 8000;
var socketRoomList = {};
var socketList = {};
var socketPort = 8111;
var interval = 200; //milliseconds
var deviceList = {};
var auto_sort_flag = true;
var audio = {};
var songList = [];
var n = 0;
var testval = 300;
//var trackIDList = {};

/*end server variables */	

io.sockets.on('connection', function (socket) {
	socket.room = "";
	socketList[socket.id] = socket;
	socket.on("subscribe", function(room, h, w) {
		
		init_socket(socket,room);
		io.sockets.in(room).emit('remove_track');
		if (socketRoomList[room] == undefined ) {
			socketRoomList[room] = {tracks: [], size: 0};
		}
		//socketRoomList[room] = socketRoomList[room] + 1;
		if (socketRoomList[room].size != undefined) {
			socketRoomList[room].size = socketRoomList[room].size + 1;
		}
		socketRoomList[room][socket.id] = {room: room, w: w, h: h, s: socket };
		console.log("room: " + room);
		socket.join(room);
		if (io.sockets.clients(room).length === 1) {
			socket.emit("playback");
			socket.emit("send_tracks");
		} else {
			readjust_devices(room, socket);
			}
			

	});
	socket.emit("requestInit");

});

function readjust_devices(room,socket) {
			var min = socket.id;
			var size = socketRoomList[room][socket.id].w * socketRoomList[room][socket.id].h;
			console.log("size: "  + size);
			for (id in socketRoomList[room]) {
				var s = socketRoomList[room][id];
				var tempsize = s.h * s.w;
				if (tempsize < size) {
					min = id;
					size = tempsize;
				}
			}
			
			var i = 0;
			//making temp hardcopy of tracklist
			var templist = {};
			for (id in socketRoomList[room].tracks) {
				templist[id] = socketRoomList[room].tracks[id];
			}
			var len = Object.keys(templist).length
			console.log('len is: ' + len);
			// below doesnt work because i have to get jquery to work with node
			//var tarray = $.map(socketRoomList[room].track, function (value, key) { return value; });
			for (id in socketRoomList[room]) {
				if (id == 'tracks') {
					continue;
				} 
				if (id == 'size') {
					continue;
				}
				if (i >= len) {
					break;
				}
				if (id != min) {
					var temptrack;
					for (key in templist) {
						temptrack = templist[key];
						delete templist[key];
						len--;
						break;
					}
					socketRoomList[room][id].s.emit("add_track", temptrack);
					//i++;
				}
				console.log('id: ' + id);
			}
			console.log(i);
			while (i < len) {
				var temptrack;
					for (key in templist) {
						temptrack = templist[key];
						delete templist[key];
						len--;
						break;
					}
				socketRoomList[room][min].s.emit("add_track", temptrack);
				//i++;
			}
		}
		


function init_socket(socket,room) {
	socket.on("newtrack", function(id) {
		console.log("STOP");
		console.log("STOP");
		console.log("STOP");
		console.log("STOP");
		console.log("STOP");
		console.log("STOP");
		console.log("STOP");
		audio_init(id);
		console.log("audio is: " + audio);
		console.log("audio is: " + audio);
		console.log("audio is: " + audio);
		console.log("audio is: " + audio);
		console.log("audio is: " + audio);
		console.log("audio is: " + audio);
		console.log("audio is: " + audio);
		console.log("audio is: " + audio);
		console.log("audio is: " + audio);
		console.log("audio is: " + audio);
	});
	socket.on("disconnect", function() {
		console.log('NEW PLAYBACK');
		if (io.sockets.clients(room).length >= 1) {
			io.sockets.clients(room)[0].emit("playback");
		}
		if (socketRoomList[room].size != undefined)
		socketRoomList[room].size = socketRoomList[room].size -1;
		readjust_devices(room, socket);
	});
  socket.on("volume", function(id, value) {
    audio[id].volume = value; //percentage value between 0 and 100 here
    io.sockets.in(room).volatile.emit("update", audio);
  });
  socket.on("mute", function(id) { //unused
    audio[id].mute = true; //boolean here
    io.sockets.in(room).volatile.emit("update", audio);
  });
  socket.on("unmute", function(id) { //unused 
    audio[id].mute = false;
    io.sockets.in(room).volatile.emit("update", audio);
  });
  socket.on("auto_off", function(id) { //unused 
    audio[id].auto = false;
    io.sockets.in(room).volatile.emit("update", audio);
  });
  socket.on("auto_on", function(id) { //unused
    audio[id].auto = true;
    io.sockets.in(room).volatile.emit("update", audio);
  });
  socket.on("speed", function(id, value) {
    audio[id].speed = value;
    io.sockets.in(room).volatile.emit("update", audio);
  });
  socket.on("play", function(id) {
    audio[id].play = true;
    io.sockets.in(room).volatile.emit("update", audio);
  });
  socket.on("pause", function(id) {
    audio[id].play = false;
    io.sockets.in(room).volatile.emit("update", audio);
  });
	/*
  socket.on("next_song", function(id, name) {
    audio_init(name);
    io.sockets.emit("update", audio); //not volatile
                                      //song change is high priority
  });*/
  socket.on("loop_off", function(id) { //unused
    audio[id].loop = false;
    io.sockets.in(room).volatile.emit("update", audio);
  });
  socket.on("loop_on", function(id) { //unused
    audio[id].loop = true;
    io.sockets.in(room).volatile.emit("update", audio);
  });
  socket.on("change_time", function(id, value) {
    audio[id].time = value;
    io.sockets.in(room).volatile.emit("update_time", value);
  });
	socket.on("sendModule", function (trackz, num) {
		console.log("trackz are: " + trackz);
		io.sockets.in(room).emit("getmod", trackz, num);
	});
	socket.on("tracklist", function(tracks) {
		console.log("RECEIVDTRACKLIST");
		socketRoomList[room].tracks = tracks;
		readjust_devices(room, socket);
	});
	/*socket.on("sendModule", function (device, module, modulename, length) {
		
		io.sockets.in(room).emit("getmod", device, module, modulename, length);
	});*/
}


/*
function rec_message(socket) {
  io.sockets.in(room).volatile.emit("update", audio);
}*/

function audio_init(id) {
	console.log("SUPPPPPPPPPPP");
	if (audio[id] == undefined) {
		audio[id] = {
			volume:  1,
			mute:  false,
			auto: true,
			speed: 1,
			play: false,
			loop: false,
			time: 0,
			start: new Date().getTime(),
			id: id
		}
	}
  /*
	audio[id].name = name;
	
  songList.push( {
    name: name,
    start: audio[id].start,
    actionList: []
  });
  n = songList.length;*/
}


function del_track() {
	io.sockets.emit("remove_track");
}

function refresh() {
	if (Object.keys(audio).length > 0) {
		io.sockets.volatile.emit("update", audio);
	}
  /*
  if (auto_sort_flag) {
    auto_sort();
  }
  audio[id].time += interval;
  */
}

function auto_sort() {

}

var intervalID = setInterval(refresh, interval);