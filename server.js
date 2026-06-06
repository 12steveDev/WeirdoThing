// server.js
const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");


const server = http.createServer((req, res)=>{
    const fName = req.url === "/" ? "index.html" : req.url;

    const fPath = path.join(__dirname, fName);

    const ext = path.extname(fPath);
    const contentType = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/javascript",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".ttf": "font/ttf",
    }[ext] || "text/plain";

    fs.readFile(fPath, (err, data)=>{
        if (err){
            res.writeHead(404);
            res.end("404: Not Found hehehe uwu");
            return
        }

        res.writeHead(200, {
            "Content-Type": contentType
        });
        res.end(data);
    });
});

// === === //
function broadcast(msg){
    msg = JSON.stringify(msg);
    wss.clients.forEach(c =>{
        c.send(msg);
    });
}
function updateConn(){
    broadcast({
        "type": "conn",
        "data": wss.clients.size
    });
}

const wss = new WebSocket.Server({ server });
wss.on("connection", (socket)=>{
    console.log("\x1b[32mCliente conectado!");
    updateConn();

    socket.on("message", (e)=>{
        try {
            const msg = JSON.parse(e.toString());
            if (msg.type === "join"){
                if (!msg.data){
                    socket.username = "AfunnyMan67";
                } else if (!(/^[a-zA-Z0-9_-]{1,20}$/.test(msg.data))){
                    socket.username = "AfunnyMan67";
                } else {
                    socket.username = msg.data;
                }
                console.log(`\x1b[32mNickname creado: ${socket.username} (${msg.data})`);
            }
            if (msg.type === "msg"){
                broadcast({
                    type: "msg",
                    data: msg.data,
                    own: socket.username
                });
                console.log(`\x1b[33mMensaje enviado: (${socket.username}) ${msg.data}`);
            }
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("close", ()=>{
        updateConn();
        console.log("\x1b[31mCliente desconectado!");
    });
})
const PORT = process.env.PORT || 3000
server.listen(PORT, ()=>{
    console.clear();
    console.log("\x1b[35m=== Servidor iniciado we ===");
});