var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var cookie = require('cookies');
var cookieParser = require('cookie-parser');

var userList = [];
var userMap = new Map();
var messages = [];

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(cookieParser());

// listen to 'chat' messages
io.on('connection', function(socket){
    
    socket.on('addUser', function(addID, addColour){
        userList.push(addID);
        userMap.set(socket, {userID: addID, colour: addColour});
        io.emit('changeList', userList);
        socket.emit('loadMessages', messages);
        socket.emit('changeID', addID);
    });
    
    socket.on('chat', function(msg, id, colour){
        
        var words = msg.split(" ");
        var firstWord = words[0];
        
        if(firstWord === "/nickcolor")
        {
            var newColour = words[1];
            userMap.set(socket, {userID: userMap.get(socket).userID, colour: newColour});
            socket.emit('changeColour', newColour);
        }
            
        else if(firstWord === "/nick")
        {
            var newID = words[1];
            var index = userList.indexOf(newID);

            if(index === -1)
            {
                socket.emit('changeID', newID);
                userList[userList.indexOf(id)] = newID;
                userMap.set(socket, {userID: newID, colour: userMap.get(socket).colour});
                io.emit('changeList', userList);
            }
        }
        
        var time = getTime();
        
        
        var message = '<li><b>' + time + '</b>' + '<span style="color:' + colour + '">' + 
        id + " </span>" + msg + '</li>';  
        
        if(messages.length < 200)
        {
            messages.push(message);      
        }
        
        else{
            messages.shift();
            messages.push(message);
        }
        
        socket.emit('chat', msg, time, id, colour, "bold");
	socket.broadcast.emit('chat', msg, time, id, colour, "");       
    });
    
    socket.on('disconnect', function(){
       userList = []; 
       userMap.delete(socket);
       
       userMap.forEach(function(userInfo, socket){
          userList.push(userInfo.userID); 
       });
       
       io.emit('changeList', userList);
    });
    
    
});


function getTime() {
    var toDisplay = "";
    var fullDate = new Date();
    var h = fullDate.getHours();
    var m = fullDate.getMinutes();

    if(m<10)
    {
        m = "0" + m;
    }

    toDisplay += h + ":" + m + "   ";
    return toDisplay;
}

app.use(express.static(__dirname + '/public'));
