import {
  joinSocketRoom,
  handleAnswerQuestionRoom,
} from "../controllers/trivia_multiplayer.controller.js";

export const onlineUsers = new Map();

const multiplayer_trivia_socket = async (io) => {
  io.on("connection", (socket) => {
    //  Record User is connection or online
    const userId = socket.handshake.query.userId;
    if (userId) {
      console.log("User connected:", socket.id, "UserID:", userId);
      onlineUsers.set(userId, socket.id);
    }

    // Join a room to play a game...
    socket.on("join-room", ({ roomId }) => {
      joinSocketRoom(socket, io, roomId, userId);
      handleAnswerQuestionRoom(socket, io, userId, roomId);
    });

    socket.on("disconnect", () => {
      if (userId) {
        onlineUsers.delete(userId);
      }
    });
  });
};

export default multiplayer_trivia_socket;
