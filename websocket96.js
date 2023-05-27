search for node express websockets
one of the most popular websocket package is socket.io
in the node app install 
npm install --save socket.io
//cors is for cross origin error i was getting
const io = require('socket.io')(server,{ cors: { origin: '*' } });
    io.on('connection', socket => {
        console.log('Client connected');
});

now in your client app it can be react or any other web 
npm install --save socket.io-client
import openSocket from 'socket.io-client';
openSocket('http://localhost:8080');

const server = app.listen(8080);
    const io = require('./socket').init(server);
    io.on('connection', socket => {
        console.log('Client connected');
    });

file socket

let io;

module.exports = {
    //init is a method 
    //recieves a parameter httpserver argument
    //body is {}
    //after , there is another function
    init: httpServer => {
        io = require('socket.io')(httpServer,{ cors: { origin: '*' } })
        return io;
    },

    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized');
        }
        return io;
    }
}

io.getIO().emit('posts',{action: 'create', post: post});


In the client side which can be react / javascript

const socket = openSocket('http://localhost:8080');
    socket.on('posts',data =>{
      if(data.action === 'create'){
        this.addPost(data.post);
      }
    })
