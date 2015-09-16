var express = require('express');
var path = require('path');
var app = express();
app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, "./views"));
app.set('view engine', 'ejs');
app.get('/', function(req, res){
	res.render("index");
});

var server = app.listen(3693);

var io = require('socket.io').listen(server);

if(!counter){
	var counter = 0;
};

io.sockets.on('connection', function(socket) {
	socket.emit('current_count', {count: counter});
	console.log("We are now using sockets");
	console.log(socket.id);
	socket.on("button_clicked", function (){
		counter += 1;
		socket.emit('server_response', {response: "You pressed the button."});
		socket.broadcast.emit('server_broadcast', {response: "Another user has pressed the button"});
		io.emit('count_update', {count: counter});
	});
	socket.on("reset_clicked", function(){
		counter = 0;
		socket.emit('server_response', {response: "You have reset the counter."});
		socket.broadcast.emit('server_broadcast', {response: "Another user has reset the counter."});
		io.emit('count_update', {count: counter});
	});
});