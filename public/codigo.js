//rellenar listausuarios
//añadir avatares
//estados
//está escribiendo

var socket = io();

var chatonscreen = false;


//BEFORE ENTERING THE CHAT
$('.acceso').keyup(function (e) {
    if (e.keyCode === 13) {
       // CHECK IF USERNAME IS AVAILABLE
       checkUsername();
    } 
    else{
    	$('button.introChat').css("visibility", "hidden");
    	$('#disp small').empty();
    }
  });

// ABOUT USERNAMES
var user;

function checkUsername(){
	user = $('.acceso').val();
    socket.emit('checkUsername', user);
};

socket.on('userExists', function(data){
	$('#disp small').empty(); 
    $('#disp small').append(data); 
});

socket.on('userAvailable', function(data){
	$('#disp small').empty();
    $('#disp small').append(data);    
    $('button.introChat').css('visibility', 'visible');
});

// CHANGE THE VIEW AND STABLISH THE USERNAME

$('a').click(function(){
	setUsername();
	$('#container').toggle();
	$('#app').toggle();
});

function setUsername(){
	socket.emit('setUsername', user);	
};
 
// USERS LIST

socket.on('usersList', function(data){
	$('.listausuarios').empty();
	var usersList = data;
	console.log(usersList);
	var avatar = "https://hdimagesnew.com/wp-content/uploads/2016/09/image-not-found.png"
	var estado = 'estado provisional'
	for (var i = 0; i < usersList.length; i++) {
	$('.listausuarios').append('<div class="chat-user col-md-12"><img src="'+avatar
	 		+'" alt="avatar" class="col-md-3"><div class="name col-md-9"><h5>'+usersList[i]
	 		+'</h5><p>'+estado+'</p></div></div>');
	}
});

// MESSAGES

	//SENDING
$('form').submit(function(){
	var msg = {emisor : user, mensaje : $('#sendm').val()}
	socket.emit('chat message', msg);
	$('#sendm').val('');
	chatonscreen = true;
	return false;
});
	//RECEIVING
socket.on('chat message', function(msg){
	//own messages
	if (msg.emisor == user){
		$('.listamensajes').append('<div class="mensaje dcha"><p>'+msg.mensaje+'</p></div><div class="clearfix"></div>');
	}
	// clients messages
	else if (( msg.emisor != 'servidor')&&(msg.emisor != user)){
	 	$('.listamensajes').append('<div class="mensaje izq"><p class="user">'+ msg.emisor+':</p><p>'+msg.mensaje+'</p></div><div class="clearfix"></div>');
	}
	//server messages about clients
	else if(( msg.emisor == 'servidor')){
			$('.listamensajes').append('<div class="mensaje servidor"><p>'+msg.mensaje+'</p></div><div class="clearfix"></div>');	
	}	
	//server messages to own client
	else if (( msg.emisor != 'servidor')&&(msg.emisor == user)&&(chatonscreen)){
	 	$('.listamensajes').append('<div class="mensaje servidor"><p>'+msg.mensaje+'</p></div><div class="clearfix"></div>');	
	}

	//autoscrolldown
	$('div.'+'clearfix')[ ($('div.'+'clearfix').length) -1].scrollIntoView();
	
});

//
