const express = require('express');
const app = express();
const http = require("http");
const { Server } = require('socket.io');
const cors = require("cors");
const { randomInt } = require('crypto');

app.use(cors());

const activeRooms = new Set();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

server.listen(3001, () => {
    console.log("Server is running");
})

io.on("connection", (socket) => {
    socket.on("create_lobby", () => {
        let roomCode = randomInt(0,9999);
        while (activeRooms.has(roomCode)) {
            roomCode = randomInt(0,9999);
        }
        activeRooms.add(roomCode);

        socket.join(roomCode);
        console.log("Lobby Time");

        socket.emit("receive_code", roomCode);
    });
});