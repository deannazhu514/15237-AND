var express = require("express");

var app = express();
var mongo = require('mongodb');

var staticPort = 8999;
var mongoPort = 9000;

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
app.get("login/:username", function(request, response) {
  
});

app.get("newRoom/:accountName", function(request, response) {
  var tempString = request.params.accoutName + (new Date())//.getTime());
  var urlHash = tempString.hashCode();
  response.send({
    url: urlHash
  });
});

app.get("/room/:roomString", function (request, response) {

});

app.listen(staticPort);

/* server variables*/
var io = require("socket.io");
var ports = {};
var minPort = 8000;
var maxPort = 8998;
var nextPort = 8000;
var interval = 3000; //milliseconds
var deviceList = {};
var auto_sort_flag = true;
var audio = {};
var songList = [];
var n = 0;


/*end server variables */

function init_socket(x, socket) {
  socket.on("volume", function(value) {
    audio.volume = value; //percentage value between 0 and 100 here
    x.sockets.volatile.emit("update", audio);
    songList[n].actionList.push({"volume": value});
  });
  socket.on("mute", function() {
    audio.mute = true; //boolean here
    x.sockets.volatile.emit("update", audio);
  });
  socket.on("unmute", function() {
    audio.mute = false;
    x.sockets.volatile.emit("update", audio);
  });
  socket.on("auto_off", function() {
    audio.auto = false;
    x.sockets.volatile.emit("update", audio);
  });
  socket.on("auto_on", function() {
    audio.auto = true;
    x.sockets.volatile.emit("update", audio);
  });
  socket.on("speed", function(value) {
    audio.volume = value;
    x.sockets.volatile.emit("update", audio);
    songList[n].actionList.push({"speed": value });
  });
  socket.on("play", function() {
    audio.play = true;
    x.sockets.volatile.emit("update", audio);
  });
  socket.on("pause", function() {
    audio.play = false;
    x.sockets.volatile.emit("update", audio);
  });
  socket.on("next_song", function(name) {
    audio_init(name);
    x.sockets.emit("update", audio); //not volatile
                                      //song change is high priority
  });
  socket.on("loop_off", function() {
    audio.loop = false;
    x.sockets.volatile.emit("update", audio);
  });
  socket.on("loop_on", function() {
    audio.loop = true;
    x.sockets.volatile.emit("update", audio);
  });
  socket.on("change_time", function(value) {
    audio.time = value;
    x.sockets.volatile.emit("update", audio);
  });
  
}

function new_port() {

  /*god im so lazy*/
  while (true) {
    var portNum = nextPort;
    if (typeof(ports[portNum]) !== 'undefined') {
      var x = io.listen(portNum);
      ports[portNum] = x;
      break;
    } else {
      nextPort++;
      if (nextPort > 8998) {
        nextPort = 8000;
      }
    }
  }
  
  x.sockets.on("connection", function(socket) {
    deviceList[socket.id] = true;
    init_socket(x,socket); 
  });
}

/*
function rec_message(socket) {
  io.sockets.volatile.emit("update", audio);
}*/

function audio_init(name) {
  audio = {
    volume:  1,
    mute:  false,
    auto: true,
    speed: 1,
    play: true,
    loop: false,
    time: 0,
    start: new Date().getTime()
  }
  audio.name = name;
  songList.push( {
    name: name,
    start: start,
    actionList: []
  });
  n = songList.length;
}




function refresh() {
  for (port in ports) {
    ports[port].sockets.volatile.emit("update", audio);
  }
  //io.sockets.volatile.emit("update", audio);
  /*
  if (auto_sort_flag) {
    auto_sort();
  }
  audio.time += interval;
  */
}

function auto_sort() {

}

var intervalID = setInterval(refresh, interval);