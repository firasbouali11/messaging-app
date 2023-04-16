const express = require('express');
const socket  = require("socket.io");
const http = require('http');
const mongoose = require("mongoose");
const cors = require("cors");
const { getUserIdFromCookie } = require('./Utils/utils');

require("dotenv").config()

const app = express();
const server = http.createServer(app);
const io = socket(server);

const port = process.env.PORT || 2020
const db_user = process.env.DB_USER || "root"
const db_pass = process.env.DB_PASS
const db_host = process.env.DB_HOST || "localhost"
const db_port = process.env.DB_PORT || "27017"


mongoose.connect(`mongodb://${db_user}:${db_pass}@${db_host}:${db_port}/`)
.then(_ => console.log("MongoDB connected successfully !"))
.catch(e => console.error(e))

app.use(express.json())
app.use(cors({
  origin:["http://localhost:3000", "http://localhost:2020/socket.io"],
  exposedHeaders:["Cookie"],
  credentials: true
}))
app.use("/user",require("./routes/userRoutes"))
app.use("/message",require("./routes/messageRoutes"))
app.use("/invitation", require("./routes/invitationRoutes"))

let connected_users = []
var map = {}

const disconnectUser = (socket) => {
  const user_id = map[socket.id]
  // console.log(user_id + "is leaving")
  delete map[socket.id]
  const index = connected_users.indexOf(user_id)
  if(index !== -1){
    connected_users.splice(index, 1)
    socket.broadcast.emit("connected", connected_users)
  }
}

io.on('connection', async (socket) => {
  console.log('a user connected ' + socket.id);

  socket.on("send_message", (msg) => {
    const {cookie, receiver, message} = msg
    if(cookie) {
      const data = {
        sender: getUserIdFromCookie(cookie),
        message,
        receiver
      }
      io.to(receiver).emit('receive_message',data)
    }
  })

  socket.on("join", (cookie)=> {
    const user_id = getUserIdFromCookie(cookie)
    if(user_id){
      map[socket.id] = user_id
      // console.log(user_id + " just joined")
      socket.join(user_id)
      if(!connected_users.includes(user_id)) connected_users.push(user_id)
      socket.broadcast.emit("connected", connected_users)
      io.to(user_id).emit('connected',connected_users)
    }
  })

  socket.on("leave", (msg) => {
    disconnectUser(socket)
  })

  socket.on("disconnect", (msg) => {
    disconnectUser(socket)
  })
  
});

server.listen(port, () => {
  console.log(`Listening on 0.0.0.0:${port}`);
});