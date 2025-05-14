import { PORT } from "./config/env.config.js";
import app from "./app.js";
import multiplayer_socket from "./socket/multiplayer_socket.js";
import { handleFriendsEvents } from "./socket/friends.socket.js";
import corsOptions from "./config/cors.config.js";
import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: corsOptions,
    credentials: true
  },
});

multiplayer_socket(io);
handleFriendsEvents(io);

server.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
