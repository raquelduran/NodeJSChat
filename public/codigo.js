//está escribiendo

var socket = io();

var chatonscreen = false;


//BEFORE ENTERING THE CHAT


$('.acceso').keyup(function (e) {
    if (e.keyCode === 13) {
       // CHECK IF USERNAME IS AVAILABLE
       if (!$('.acceso').val().trim()){
       		$('#disp small').empty();
       		$('#disp small').append("Debes introducir un usuario"); 
       } 
       else if ($("img.focus").attr("src") == undefined){
    		$('#disp small').empty();
    		$('#disp small').append("Debes elegir un avatar");
    	}
       else {
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
       if (!$('.acceso').val().trim()){
       		$('#disp small').empty();
       		$('#disp small').append("Debes introducir un usuario"); 
       } 
       else if ($("img.focus").attr("src") == undefined){
       		$('#disp small').empty();
       		$('#disp small').append("Debes elegir un avatar");
       }
       else{
       		checkUsername();
       }
    } 
  });


// SETTING THE USER
var user;
var avatar;
var estado;

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
	//AVATAR

$( "img.choice" ).click(function(){
	$("img.choice").removeClass("focus");
	$(this).addClass("focus");
	avatar = $("img.focus").attr("src");
	if ($('.acceso').val().trim()){
		checkUsername();
	}
})
// CHANGE THE VIEW AND STABLISH THE USER IN THE SERVER

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
	var isTyping = "";
	// var isTyping = " is typing..."

	for (var i = 0; i < usersList.length; i++) {
		if (usersList[i].usuario == user){
				//OWN USER
			$('.listausuarios').append('<div class="chat-user col-md-12"><img id="'+usersList[i].usuario+
				'"src="'+usersList[i].avatar
	 		+'" alt="avatar" class="col-md-3"><div class="name col-md-9"><h5>'+usersList[i].usuario
	 		+'<small>'+isTyping+'</small></h5><p>'+usersList[i].estado+'</p></div></div>');
		} else{
				//REST OF USERS
			$('.listausuarios').append('<div class="chat-user col-md-12"><img src="'+usersList[i].avatar
	 		+'" alt="avatar" class="col-md-3"><div class="name col-md-9"><h5>'+usersList[i].usuario
	 		+'<small>'+isTyping+'</small></h5><p>'+usersList[i].estado+'</p></div></div>');
		}	
	}
	$('img#'+user).addClass('focus');
});

// MESSAGES

	//SENDING
$('form').submit(function(){
	 if ($('#sendm').val().trim()){ 
		var msg = {emisor : user, mensaje : $('#sendm').val()}
		socket.emit('chat message', msg);
		$('#sendm').val('');
		chatonscreen = true;
		return false;
	} else {  //doesn't do anything if #sendm is blank
		return false;
	}
	
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

// SHOW WHEN SOMEBODY IS TYPING

// var typingTimer;

// $('#sendm').keydown(function(e) {
// 	if (e.keyCode != 8) {
//     	clearTimeout(typingTimer);
//     	typingTimer = setTimeout(function () {$("p.content").html('Typing...');}, 10);
//     }
// });

// $('#sendm').keyup(function(e) {
// 	clearTimeout(typingTimer);
//     typingTimer = setTimeout(function () {$("p.content").html('');}, 500);
// });