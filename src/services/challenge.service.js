const ChallengeRoom = require("../models/ChallengeRoom.model");
const axios = require("axios");
const shuffleArray = require("../utils/shuffle");

const fetchTriviaQuestions = async (amount = 5, difficulty = "easy") => {
  const res = await axios.get(
    `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`
  );

  const questions = res.data.results.map((q) => {
    const allAnswers = shuffleArray([
      ...q.incorrect_answers,
      q.correct_answer,
    ]);

    return {
      question: q.question,
      correct_answer: q.correct_answer,
      incorrect_answers: q.incorrect_answers,
      all_answers: allAnswers,
    };
  });

  return questions;
};

// ✅ 1. Create a new challenge room
const createRoom = async (hostId, difficulty = "easy") => {
  const questions = await fetchTriviaQuestions(5, difficulty);
  const room = await ChallengeRoom.create({
    host: hostId,
    questions,
  });
  return room;
};

// ✅ 2. Join a room
const joinRoom = async (roomId, guestId) => {
  const room = await ChallengeRoom.findById(roomId);
  if (!room) throw new Error("Room not found");
  if (room.guest) throw new Error("Room already has a guest");

  room.guest = guestId;
  room.status = "in_progress";
  await room.save();

  return room;
};

// ✅ 3. Submit answer
const submitChallengeAnswer = async ({ roomId, userId, answer, index }) => {
  const room = await ChallengeRoom.findById(roomId);
  if (!room) throw new Error("Room not found");
  const question = room.questions[index];
  const isCorrect = question.correct_answer === answer;

  const entry = { answer, isCorrect };

  if (userId.equals(room.host)) {
    room.hostAnswers[index] = entry;
  } else if (userId.equals(room.guest)) {
    room.guestAnswers[index] = entry;
  } else {
    throw new Error("Not a participant");
  }

  // Mark as complete if both have answered all questions
  const hostDone = room.hostAnswers.length === room.questions.length;
  const guestDone = room.guestAnswers.length === room.questions.length;

  if (hostDone && guestDone && room.status !== "completed") {
    const hostScore = room.hostAnswers.filter(a => a.isCorrect).length;
    const guestScore = room.guestAnswers.filter(a => a.isCorrect).length;

    if (hostScore > guestScore) room.winner = room.host;
    else if (guestScore > hostScore) room.winner = room.guest;
    else room.winner = null; // draw

    room.status = "completed";
  }

  await room.save();
  return { isCorrect };
};

module.exports = {
  createRoom,
  joinRoom,
  submitChallengeAnswer,
};
