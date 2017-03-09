var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var cookie = require('cookies');
var cookieParser = require('cookie-parser');

var userList = [];

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(cookieParser());

//skeleton taken from expressjs.com tutorials
app.get('/', function(req, res, next){
   if(req.cookies.user === undefined || req.cookies.user === null) 
   {
       userID = "user" + Math.floor((Math.random()*1000) + 1);
       res.cookie("userID", userID);
       userList.push(userID);
   }
   
   if(req.cookies.user === undefined || req.cookies.user === null) 
   {
       userColour = "red";
       res.cookie("userColour", userColour);
   }
   
    next();    
});

// listen to 'chat' messages
io.on('connection', function(socket){
    socket.on('chat', function(msg, id, colour){
        
        var words = msg.split(" ");
        var firstWord = words[0];
        
        if(firstWord === "/nickcolor")
        {
            var newColour = words[1];
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

            }
        }
        
        console.log(userList);
        
	io.emit('chat', msg, getTime(), id, colour);       
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
