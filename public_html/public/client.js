// shorthand for $(document).ready(...)
$(function() {
    var socket = io();
    $('form').submit(function(){
	socket.emit('chat', $('#m').val(), getCookie("userID"), getCookie("userColour"));
	$('#m').val('');
	return false;
    });
    
    socket.on('chat', function(msg, time, id, colour){
	$('#messages').append($('<li><b>' + time + '</b>' + '<span style="color:' + colour + '">' + 
                      id + " </span>" + msg + '</li>'));
    });
    
    socket.on('changeColour', function(colour){
        setCookie('userColour', colour);
    });
    
    socket.on('changeID', function(id){
        setCookie('userID', id);
    });
    
});

//function found at https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
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
