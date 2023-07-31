const express = require('express');
const app = express();
const SocketIO = require("socket.io");

app.set("port", process.env.PORT || 3000);

app.use(express.static(__dirname + "/public"));

const server = app.listen(app.get("port"), () => {
    console.log("server on port" + app.get("port"));
});

const io = SocketIO(server);

io.on("connection", (socket) => {
    console.log("new connection", socket.id);

    socket.on("chat:message", (data) => {
        socket.broadcast.emit("chat:message", data);
        console.log(data);
    });

    socket.on("chat:file", (data) => {
        socket.broadcast.emit("chat:file", data);
        console.log(data);
    });
});