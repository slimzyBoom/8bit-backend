import { PORT } from "./config/env.config.js";
import app from "./app.js";
import multiplayer_socket from "./socket/multiplayer_socket.js";
import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

multiplayer_socket(io);

server.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
