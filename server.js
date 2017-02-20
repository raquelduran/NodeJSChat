var express = require('express');
app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

// express.get('/', function(req, res){
//   res.sendFile(__dirname + "/index.html");
// });

io.on('connection', function(socket){
	socket.on('chat message', function(msg){
   		io.sockets.emit('chat message', msg);
  	});
})


const PORT = process.env.PORT || '3030'

http.listen(PORT, function(){
  console.log('listening on *:3030');
});