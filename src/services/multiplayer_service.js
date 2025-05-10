import Room from "../models/trivial_multiplayer_session.model.js";
import User from "../models/user.model.js"

export const handleJoinRoom = async (io, socket, roomCode, id) => {
    try {
        const room = await Room.findOne({ roomCode });
        if(!room || room.waiting != "waiting"){
            socket.emit("error", "Room is not available. ")
            return
        }
        const user = await User.findById(id)

        room.players.push({ userId: user.id, username: user.username, avatar: user.avatar })

        socket.join(roomCode);
        io.to(roomCode).emit("player_joined", room.players)

        if(room.players.length >= 2){
            room.status = "in=-progress"
            await room.save()
            io.to(roomCode).emit('start_game', room.questions[0]);
        }
    } catch (error) {
        console.error("Error creating room: ", error)
    }
}

// 
export const handleAnswerQuestionRoom = async (socket, io, userId, roomCode, answer) => {
    try {
        const room  = await Room.findOne({ roomCode })
        const currentQuestion = room.questions[room.currentQuestionIndex]

        const player = room.players.find((player) => player.id === userId)
        if(currentQuestion.correct_answer === answer){
            player.score += 1
        }
        room.currentQuestionIndex += 1

        if(room.currentQuestionIndex === room.totalQuestions){
            room.status = "completed",
            await room.save();
            io.to(roomCode).emit("game-over", room.players)
        }else{
            await room.save();
            io.to(roomCode).emit("next-question", room.questions[room.currentQuestionIndex])
        }
    } catch (error) {
        console.log("Error answering question")
    }
}
