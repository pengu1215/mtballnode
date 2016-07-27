var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var count = 0;

app.get('/', function(req, res){
   res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    
    console.log('*user '+socket.id+' connected');
    
    socket.on('mobileReady', function(screen) {
        console.log('***Game Start***');
        console.log('screen : '+screen.width +" / "+screen.height);
        socket.emit('mobileStart');
        socket.broadcast.emit('gameStart', screen);
    });
    
    //TODO mobile Pause()
    //TODO mobile Resume()
    
    socket.on('ballPosition', function(ball){
        console.log("x:"+ball.bx+" y:"+ball.by+" color:"+ball.color);
        socket.broadcast.emit('setBallPosition', ball);   
    });
    
    // socket.on('ballVelocity', function (ball) {
    //     console.log("x:"+ball.bx+" y:"+ball.by+" vx:"+ball.velocityX+" vy:"+ball.velocityY+" color:"+ball.color);
    //     socket.broadcast.emit('setBallVelocity', ball);
    // });
    
    socket.on('stickPosition', function(stickArray){
        console.log(stickArray.length);
        socket.broadcast.emit('setStickPosition', stickArray);   
    });  
    
    socket.on('collide', function(collide){
        console.log("collide||"+"x:"+collide.x+" y:"+collide.y);
        socket.broadcast.emit('setCollide', collide);   
    });
    
    socket.on('disconnect', function(){
        console.log('*user '+socket.id+' disconnected');
        socket.broadcast.emit('gameEnd');
    });
});

http.listen(3000, function(){
    console.log('listening...');
});