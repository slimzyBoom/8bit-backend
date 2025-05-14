import User from "../models/user.model.js";
import { onlineUsers } from "./multiplayer_socket.js";

export const handleFriendsEvents = (io) => {
  io.on("connection", (socket) => {
    socket.on("get_online_friends", async ({ userId }) => {
      try {
        const user = await User.findById(userId).exec();
        if (!user || !user.friends) return;

        // Filter friends who are online
        const onlineFriends = user.friends.filter(friend =>
          onlineUsers.has(friend.toString())
        );

        // Send only to the requesting socket
        socket.emit("online_friends", onlineFriends);
      } catch (error) {
        console.error("Error in get_online_friends:", error);
        socket.emit("friends-error", { message: "Error getting online friends", success: false });
      }
    });
  });
};
