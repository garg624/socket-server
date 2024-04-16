import express from "express"
import cors from 'cors'
import { createServer } from 'node:http';
import {Server} from "socket.io"
import dotenv from "dotenv"
dotenv.config({
    path:"./env"
})
const port=process.env.PORT || 8000;

const app = express();
const server=createServer(app)
const io=new Server(server)

// this cors is for the rest api's
app.use(cors()) 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>This a web socket server </h1>');
  });
app.get("/healthCheck",(req,res)=>{
    // console.log("Health check")
    res.status(200).json("Working fine")
});

  let roomData ={}; //? roomId:Int :: data:String
//   let users = {}; I'll implement the record of the user after the basic  functionality works.

io.on('connection', (socket) => {

    //? test console
    console.log('A new user connected');
    console.log("Socket Id : ",socket.id)

    // socket.broadcast.emit("server-saidHello",`${socket.id} joined`);

    socket.on('sendMessage', (data) => {
        //? test console
        console.log('Message received from client:', data);

        roomData[data.roomId] = data.value;
        
        // console.log('roomData:', roomDatadata]); // Log roomData to verify
    
        socket.to(data.roomId).emit('storedData', data.value);

        // console.log("data",roomData)
    });
    
    socket.on('joinRoom', (room) => {
        //? test console
        // console.log("data",roomData)
        // console.log('Client joined room:', room);
        socket.join(room);
        // console.log('Client rooms:', socket.rooms); // Log client's rooms to verify
        if (roomData[room]) {
            // console.log('Emitting storedData to client:', socket.id);
            io.to(socket.id).emit('storedData', roomData[room]);
        }
    });
    socket.on('disconnect', function() {
        console.log('Socket disconnected');
      });
    
    
 
});

// say something to every one



server.listen(port ,()=>{
    console.log(`Server is running on port ${port}`)
})

app.on("error", ()=>{
    console.log("Server is not running")
})

app.on("connection", ()=>{
    console.log("Server is connected")
})