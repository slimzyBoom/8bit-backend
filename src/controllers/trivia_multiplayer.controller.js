import Room from "../models/trivial_multiplayer_session.model.js";
import User from "../models/user.model.js";
import { generate_room_code } from "../utils/generateCode.util.js";
import { getTrivialQuiz } from "../services/trivial_api.service.js";

export const generateAndSaveRoom = async (req, res) => {
  const { amount, category, difficulty, type } = req.body;
  const { id } = req.user
  try {
    const generateQuiz = await getTrivialQuiz({ amount, category, difficulty, type })
    const roomId = generate_room_code();
    const user = await User.findById(id).exec();

    const room = new Room({
        userId: id,
        roomId,
        players: [
            {
                userId : id,
                username : user.username || "",
                avatar: user.avatar || ""
            }
        ],
        questions: generateQuiz,
        totalQuestions: generateQuiz.length()

    })

    await room.save();

    res.status(201).json({ message: "Room created successfully", data: roomId, success: true})
  } catch (error) {
    console.error("Create room error: ", error);
    res.status(500).json({ error: "Failed to create room", success: false });
  }
};
