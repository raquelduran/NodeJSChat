var express = require('express');
app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

var users = [];

io.on('connection', function(socket){
	// USERS NAMES 
	socket.on('checkUsername', function(data){
	    if (users.indexOf(data) > -1) {
	      	socket.emit('userExists', data + ' no está disponible');
	    }
	    else {
	    	socket.emit('userAvailable', data + ' disponible');
	    }
  	});
    //STABLISH USER NAMES
	socket.on('setUsername', function(data){
		users.push(data);
		socket.name = data;
		console.log("entrada usuario "+users);
		// FOR THE REST OF THE CLIENTS
		var msg = {emisor: 'servidor', mensaje: socket.name +' se ha unido al canal', usuario: socket.name};
		socket.broadcast.emit('chat message', msg);
		// FOR CURRENT CLIENT
		var msg = {emisor: 'servidor', mensaje: 'Bienvenido al canal', usuario: socket.name};
		socket.emit('chat message', msg);

		socket.broadcast.emit('usersList', users);
		socket.emit('usersList', users);
	})

	// MESSAGES
	socket.on('chat message', function(msg){
   		io.sockets.emit('chat message', msg);
  	});

	// DISCONNECTION
	socket.on('disconnect', function(){
        var msg = {emisor: 'servidor', mensaje: socket.name +' ha dejado el canal', usuario: socket.name};
		socket.broadcast.emit('chat message', msg);
		var currentIndex = users.indexOf(socket.name);
		users.splice(currentIndex, 1);
		socket.broadcast.emit('usersList', users);
		console.log("salida de usuario" + users);
    });
})


const PORT = process.env.PORT || '3030';

http.listen(PORT, function(){
  console.log('listening on *:3030');
});