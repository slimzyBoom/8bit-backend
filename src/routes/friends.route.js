import express from "express";
import { onlineUsers } from "../socket/multiplayer_socket";
import User from "../models/user.model";
const router = express.Router();

router.get("/online-friends", async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id).exec();
    const onlineFriends = user.friends.filter((id) => onlineUsers.has(id));
    res.status.json(onlineFriends);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server error : Failed to get online friends ",
    });
    console.error("Failed to fetch online friends list");
  }
});

router.get("/friend-request-list", async (req, res) => {
  const { id } = req.user;
  if (id) {
    return res.status(401).json({ error: "Unauthorized", success: false });
  }
  try {
    const user = await User.findById(id).exec();
    const friend_request_list = user.friend_request_list;
    if (friend_request_list <= 0) {
      res.json({
        message: "There is no pending friend request",
        data: friend_request_list,
      });
      return;
    }
    res.json({ data: friend_request_list });
  } catch (error) {
    console.error("Server error :", error);
    res.status(500).json({ error: "Server error : Not getting friend list " });
  }
});

export default router;
