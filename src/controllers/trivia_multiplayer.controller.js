import Room from "../models/trivial_multiplayer_session.model.js";
import User from "../models/user.model.js";
import { generate_room_code } from "../utils/generateCode.util.js";
import { getTrivialQuiz } from "../services/trivial_api.service.js";

export const generateAndSaveRoom = async (req, res) => {
  const { amount, category, difficulty, type } = req.body;
  const { id } = req.user;
  try {
    const generateQuiz = await getTrivialQuiz({
      amount,
      category,
      difficulty,
      type,
    });
    const roomId = generate_room_code();
    const user = await User.findById(id).exec();

    const room = new Room({
      hostId: id,
      roomId,
      players: [
        {
          userId: id,
          username: user.username || "",
          avatar: user.avatar || "",
        },
      ],
      questions: generateQuiz,
      totalQuestions: generateQuiz.length(),
    });

    await room.save();

    res.status(201).json({
      message: "Room created successfully",
      data: roomId,
      success: true,
    });
  } catch (error) {
    console.error("Create room error: ", error);
    res.status(500).json({ error: "Failed to create room", success: false });
  }
};

// IO socket to handle joining a room

export const joinSocketRoom = async (socket, io, roomId, userId) => {
  try {
    const room = await Room.findOne({ roomId }).exec();

    if (!room) {
      socket.emit("room-error", { message: "Room not found", success: false });
      return;
    }

    if (room.status !== "waiting" || room.players.length >= 2) {
      socket.emit("room-error", {
        message: "Room not available for joining",
        success: false,
      });
      return;
    }

    // Join socket room
    socket.join(roomId);

    const user = await User.findById(userId).exec();
    if (!user) {
      socket.emit("room-error", { message: "User not found", success: false });
      return;
    }

    // Push player to room
    room.players.push({
      userId: user._id,
      username: user.username || "",
      avatar: user.avatar || "",
    });

    // If room now has 2 players, update status
    if (room.players.length === 2) {
      room.status = "in_progress";
    }

    await room.save();

    // Notify all clients in room
    io.to(roomId).emit("room-joined", {
      message: "User joined room successfully",
      room: {
        roomId: room.roomId,
        players: room.players,
        status: room.status,
      },
      success: true,
    });
  } catch (error) {
    console.error("Error joining socket room:", error);
    socket.emit("room-error", { message: "Server error", success: false });
  }
};

// IO socket to handle answering a question
// This function handles the answer-question event for a multiplayer trivia game.
// It checks if the room exists and is not completed, validates the question index,
// checks if the player is in the room, and if they have already answered the question.
export const handleAnswerQuestionRoom = (socket, io, userId, roomCode) => {
  socket.on("answer-question", async ({ answer, questionIndex }) => {
    try {
      const room = await Room.findOne({ roomCode });

      // Check if the room exists and is not completed
      // The room should be in progress and not completed
      if (!room || room.status === "completed") {
        socket.emit("room-error", {
          message: "Room not found or already completed",
          success: false,
        });
        return;
      };

      // Check if the question index is valid
      // The questionIndex should be within the range of the questions array
      if (
        questionIndex >= room.questions.length ||
        questionIndex < 0
      ) {
        socket.emit("room-error", {
          message: "Invalid question index",
          success: false,
        });
        return;
      };

      const currentQuestion = room.questions[questionIndex];
      const correct = currentQuestion.answer === answer;

      // Check if the player is in the room
      // The player should be found in the room's players array
      const player = room.players.find((p) => p.userId.toString() === userId);
      if (!player) {
        socket.emit("room-error", {
          message: "Player not found in room",
          success: false,
        });
        return;
      };

      const alreadyAnswered = player.questionAnswered.find(
        (q) => q.questionIndex === questionIndex
      );
      if (alreadyAnswered) {
        socket.emit("room-error", {
          message: "Question already answered",
          success: false,
        });
        return;
      };

      player.questionAnswered.push({
        questionIndex,
        answer,
        isCorrect: correct,
      });

      if (correct) player.score += 1;
      player.currentQuestionIndex += 1;

      const playerFinished =
        player.currentQuestionIndex >= room.totalQuestions;

      // Broadcast progress to both players
      io.to(roomCode).emit("update-players", {
        playerId: player.userId,
        username: player.username,
        score: player.score,
        currentQuestionIndex: player.currentQuestionIndex,
      });

      if (playerFinished) {
        room.status = "completed";
        room.endedAt = new Date();

        room.players = room.players.map((p) => ({
          ...p.toObject(),
          isWinner: p.userId.toString() === userId,
        }));

        await room.save();

        io.to(roomCode).emit("game-over", {
          winner: {
            userId: player.userId,
            username: player.username,
            score: player.score,
          },
          players: room.players,
        });

        return; // Exit early if game is over
      }

      await room.save();

      // Don't emit next-question if room already ended
      const freshRoom = await Room.findOne({ roomCode }); // optional reload
      if (freshRoom.status === "completed") {
        socket.emit("room-error", {
          message: "Room already completed",
          success: false,
        });
        return;
      };

      // Safe to send next question to player
      socket.emit(
        "next-question",
        room.questions[player.currentQuestionIndex]
      );
    } catch (err) {
      console.error("Error handling answer-question:", err);
    }
  });
};
