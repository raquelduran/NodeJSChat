
//nombre no funciona, undefined. 


var chatonscreen = false;

if (!chatonscreen){
	var socket = io();
}

//BEFORE ENTERING THE CHAT
$('.acceso').keyup(function (e) {
    if (e.keyCode === 13) {
       // CHECK IF USERNAME IS AVAILABLE
       checkUsername();
    } 
    else{
    	$('button.introChat').css("visibility", "hidden");
    	$('#disp small').html('');
    }
  });

// ABOUT USERNAMES
var user;

function checkUsername(){
	user = $('.acceso').val();
    socket.emit('checkUsername', user);
};

socket.on('userExists', function(data){
    $('#disp small').append(data); 
});

socket.on('userAvailable', function(data){
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

//









// MESSAGES
$('form').submit(function(){
	chatonscreen = true;
	var msg = {emisor : user, mensaje : $('#sendm').val()}
	socket.emit('chat message', msg);
	$('#sendm').val('');
	return false;
});

socket.on('chat message', function(msg){
	console.log("mgs usuario" + msg.usuario);
	console.log("user "+ user);
	//own messages
	if (msg.emisor == user){
		$('.listamensajes').append('<div class="mensaje dcha"><p>'+msg.mensaje+'</p></div><div class="clearfix"></div>');
	}
	// clients messages
	else if (( msg.emisor != 'servidor')&&(msg.emisor != user)){
	 	$('.listamensajes').append('<div class="mensaje izq"><p class="user">'+ msg.emisor+':</p><p>'+msg.mensaje+'</p></div><div class="clearfix"></div>');
	}
	//server messages about clients
	else if( msg.emisor == 'servidor'){
			$('.listamensajes').append('<div class="mensaje servidor"><p>'+msg.mensaje+'</p></div><div class="clearfix"></div>');	
	}	
	//server messages to own client
	else if (( msg.emisor != 'servidor')&&(msg.emisor == user)){
	 	$('.listamensajes').append('<div class="mensaje servidor"><p>'+msg.mensaje+'</p></div><div class="clearfix"></div>');	
	}



	//autoscrolldown
	$('div.'+'clearfix')[ ($('div.'+'clearfix').length) -1].scrollIntoView();
	
});

