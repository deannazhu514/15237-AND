/* server variables*/
var io = require("socket.io").listen(8888);
var interval = 3000; //milliseconds
var deviceList = {};
var auto_sort_flag = true;
var audio = {};
var songList = [];
var n = 0;


/*end server variables */

function init_socket(socket) {
  socket.on("volume", function(value) {
    audio.volume = value; //percentage value between 0 and 100 here
    io.sockets.volatile.emit("update", audio);
    songList[n].actionList.push({"volume": value});
  });
  socket.on("mute", function() {
    audio.mute = true; //boolean here
    io.sockets.volatile.emit("update", audio);
  });
  socket.on("unmute", function() {
    audio.mute = false;
    io.sockets.volatile.emit("update", audio);
  });
  socket.on("auto_off", function() {
    audio.auto = false;
    io.sockets.volatile.emit("update", audio);
  });
  socket.on("auto_on", function() {
    audio.auto = true;
    io.sockets.volatile.emit("update", audio);
  });
  socket.on("speed", function(value) {
    audio.volume = value;
    io.sockets.volatile.emit("update", audio);
    songList[n].actionList.push({"speed": value });
  });
  socket.on("play", function() {
    audio.play = true;
    io.sockets.volatile.emit("update", audio);
  });
  socket.on("pause", function() {
    audio.play = false;
    io.sockets.volatile.emit("update", audio);
  });
  socket.on("next_song", function(name) {
    audio_init(name);
    io.sockets.emit("update", audio); //not volatile
                                      //song change is high priority
  });
  socket.on("loop_off", function() {
    audio.loop = false;
    io.sockets.volatile.emit("update", audio);
  });
  socket.on("loop_on", function() {
    audio.loop = true;
    io.sockets.volatile.emit("update", audio);
  });
  socket.on("change_time", function(value) {
    audio.time = value;
    io.sockets.volatile.emit("update", audio);
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

io.sockets.on("connection", function(socket) {
  deviceList[socket.id] = true;
  init_socket(socket);
  
});


function refresh() {
  //io.sockets.volatile.emit("update", audio);
  if (auto_sort_flag) {
    auto_sort();
  }
  audio.time += interval;
}

function auto_sort() {

}

var intervalID = setInterval(refresh, interval);