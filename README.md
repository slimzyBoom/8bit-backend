# 8bit-backend

# 🎮 Casual Trivia Game Platform – Backend (MVP)

This is the backend for a multiplayer trivia game platform. It handles user authentication, trivia question sessions, game scoring, leaderboards, and challenge rooms.

## 🔧 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Axios (for fetching trivia questions)

---

## 🚀 API Endpoints

### ✅ Auth Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login user and receive JWT token |

### 🎮 Trivia Game

| Method | Route | Description |
|--------|-------|-------------|
| GET    | `/api/trivia/start` | Start a new trivia session *(Auth required)* |
| POST   | `/api/trivia/answer` | Submit answer for a question *(Auth required)* |

### 🏆 Game Stats & Leaderboard

| Method | Route | Description |
|--------|-------|-------------|
| POST   | `/api/games/submit-score` | Submit final score after trivia game *(Auth required)* |
| GET    | `/api/games/leaderboard/:gameId` | Get leaderboard for a game session |

### 👥 Challenge Rooms

| Method | Route | Description |
|--------|-------|-------------|
| POST   | `/api/challenges/create` | Create a new challenge room *(Auth required)* |
| POST   | `/api/challenges/:roomId/join` | Join an existing challenge room *(Auth required)* |
| POST   | `/api/challenges/submit` | Submit challenge answer *(Auth required)* |

---

## 🔐 Authorization

All routes (except auth) require Bearer Token authentication.

```http
Authorization: Bearer <your_token_here>
