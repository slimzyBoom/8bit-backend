import {
  handleJoinRoom,
  handleAnswerQuestionRoom,
} from "../services/multiplayer_service.js";

export const onlineUsers = new Map();

const multiplayer_trivia_socket = async (io) => {
  io.on("connction", (socket) => {
    console.log("User is connected ", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId) {
      onlineUsers.set(userId, socket.id);
    }

    socket.on("join-room", ({ roomId }) => {
      handleAnswerQuestionRoom({ io, socket, userId, roomId });
    });

    socket.on("disconnect", () => {
      if (userId) {
        onlineUsers.delete(userId);
      }
    });
  });
};

export default multiplayer_trivia_socket;
