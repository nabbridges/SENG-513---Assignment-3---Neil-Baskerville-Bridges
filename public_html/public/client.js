// shorthand for $(document).ready(...)
$(function() {
    var socket = io();
    
    //skeleton taken from expressjs.com tutorials
    if((getCookie("userID") === "" || getCookie("userID") === null) && (getCookie("userColour") === "" || getCookie("userColour") === null)) 
    {
        var userID = "user" + Math.floor((Math.random()*1000) + 1);
        setCookie("userID", userID);

        var userColour = "red";
        setCookie("userColour", userColour);
        socket.emit('addUser', userID, userColour);
    }
    
    else{
        var userID = getCookie("userID");
        var userColour = getCookie("userColour");
        socket.emit('addUser', userID, userColour);
    }
    
    socket.on('loadMessages', function(messages){
       for(var i = 0; i < messages.length; i++)
       {
           $('#messages').append(messages[i]);
       } 
    });
    
    $('form').submit(function(){
	socket.emit('chat', $('#m').val(), getCookie("userID"), getCookie("userColour"));
	$('#m').val('');
	return false;
    });
    
    
    socket.on('chat', function(msg, time, id, colour, style){
        
        if(style === "bold")
        {
            $('#messages').append($('<li><b>' + time + '</b>' + '<span style="color:' + colour + '">' + 
                           id + " </span><b>" + msg + '</b></li>'));   
        }
        else
        {
            $('#messages').append($('<li><b>' + time + '</b>' + '<span style="color:' + colour + '">' + 
                           id + " </span>" + msg + '</li>'));  
        }

    });
    
    socket.on('changeColour', function(colour){
        setCookie('userColour', colour);
    });
    
    socket.on('changeID', function(id){
        setCookie('userID', id);
        $('div.currentUser').html("<h1>User ID: " + id + '</h1>');      
    });
    
    socket.on('changeList', function(users){
       console.log(users);
       var temp = "";
       for(var i = 0; i < users.length; i++){
           temp += '<li>' + users[i] + '</li>';
       }
       $('#users').html(temp);
    });
});

//function found at https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";";
}
