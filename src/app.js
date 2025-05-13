const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const triviaRoutes = require("./routes/trivia.routes");
const statsRoutes = require("./routes/stats.routes");
const challengeRoutes = require("./routes/challenge.routes");
//const flipbitRoutes = require("./routes/flipbitGame.routes");


const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trivia", triviaRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/challenges", challengeRoutes);
//app.use("/api/flipbit", flipbitRoutes);



module.exports = app;
