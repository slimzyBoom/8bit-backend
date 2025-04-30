const {
    createRoom,
    joinRoom,
    submitChallengeAnswer,
  } = require("../services/challenge.service");
  
  exports.createRoom = async (req, res, next) => {
    try {
      const room = await createRoom(req.user._id, req.body.difficulty);
      res.status(201).json({ success: true, room });
    } catch (err) {
      next(err);
    }
  };
  
  exports.joinRoom = async (req, res, next) => {
    try {
      const room = await joinRoom(req.params.roomId, req.user._id);
      res.json({ success: true, room });
    } catch (err) {
      next(err);
    }
  };
  
  exports.submitAnswer = async (req, res, next) => {
    try {
      const { roomId, answer, index } = req.body;
      const result = await submitChallengeAnswer({
        roomId,
        userId: req.user._id,
        answer,
        index,
      });
      res.json({ success: true, result });
    } catch (err) {
      next(err);
    }
  };
  