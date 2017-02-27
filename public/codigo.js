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
       if ($('.acceso').val() ==''){
       		$('#disp small').empty();
       		$('#disp small').append("debes introducir un usuario"); 
       } else {
       		checkUsername();
       }      
    } 
    else {
    	$('button.introChat').css("visibility", "hidden");
    	$('#disp small').empty();
    }
  });

$('.acceso2').keyup(function (e) {
    if (e.keyCode === 13) {
       // CHECK IF USERNAME IS AVAILABLE
       if ($('.acceso').val() ==''){
       		$('#disp small').empty();
       		$('#disp small').append("debes introducir un usuario"); 
       } else{
       		checkUsername();
       }
    } 
  });

// ABOUT USERNAMES
var user;
var avatar;
var estado;

$( "img.choice" ).click(function(){
	$("img.choice").removeClass("focus");
	$(this).addClass("focus");
	avatar = $("img.focus").attr("src");

})

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

$('a.entry').click(function(){
	estado = $('.acceso2').val();

	setUsername();
	$('#container').toggle();
	$('#app').toggle();
});

function setUsername(){
	var data = {usuario: user, avatar: avatar , estado: estado }
	socket.emit('setUsername', data);	
};
 
// USERS LIST

socket.on('usersList', function(data){
	$('.listausuarios').empty();
	var usersList = data;
	console.log(usersList);
	// var avatar = "https://hdimagesnew.com/wp-content/uploads/2016/09/image-not-found.png"
	// var estado = 'estado provisional'
	for (var i = 0; i < usersList.length; i++) {
	$('.listausuarios').append('<div class="chat-user col-md-12"><img src="'+usersList[i].avatar
	 		+'" alt="avatar" class="col-md-3"><div class="name col-md-9"><h5>'+usersList[i].usuario
	 		+'</h5><p>'+usersList[i].estado+'</p></div></div>');
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
	//server messages
	else if( msg.emisor == 'servidor'){
			$('.listamensajes').append('<div class="mensaje servidor"><p>'+msg.mensaje+'</p></div><div class="clearfix"></div>');
	}

	//autoscrolldown
	$('div.'+'clearfix')[ ($('div.'+'clearfix').length) -1].scrollIntoView();
	
});

//
