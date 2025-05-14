# 🎮 8bit Studios - Backend

This is the backend for the **Casual Web Game Platform**, a unified system that supports multiple casual games like **Trivia** and **Memory Card**, with real-time multiplayer features, user sessions, leaderboards, and social interactions.

---

## 🚀 Features

- 🧠 **Trivia Game**
  - Single & Multiplayer mode
  - Dynamic quiz generation via Open Trivia API
  - Session tracking and score management

- 🃏 **Memory Card Game**
  - Turn-based matching game
  - Real-time room synchronization

- 👥 **Multiplayer Matchmaking**
  - Room creation & joining
  - Game state synchronization
  - Real-time interactions using WebSocket

- 👤 **User Authentication**
  - JWT-based session management
  - User avatars via Multiavatar

---

## 📁 Project Structure

```
/src
│
├── controllers/       # Route logic (game sessions, auth, rooms, etc)
├── models/            # Mongoose schemas for User, Session, Room, etc
├── routes/            # Express routers
├── services/          # Core services (e.g., triviaFetcher, roomManager)
├── socket/            # Socket.IO logic for multiplayer games
├── utils/             # Utility helpers (e.g., avatarGen, shuffleArray)
├── middlewares/       # Auth & error handling middleware
└── index.js           # Server bootstrap
```

---

## 🔧 Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/casual-game-backend.git
   cd casual-game-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file:

   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/casual-game
   JWT_SECRET=yourSecretKey
   CLIENT_URL=http://localhost:3000
   ```

4. **Run server**
   ```bash
   npm run dev
   ```

---

## 📌 Key Endpoints

### 🧠 Trivia Game (Single Player)
| Method | Endpoint                  | Description                   |
|--------|---------------------------|-------------------------------|
| POST   | `/api/trivia/single-player/create-session` | Create a trivia session       |
| POST   | `/api/trivia/single-player/answer/:sessionId` | Submit answer to a question   |
| POST   | `/api/trivia/single-player/result/:sessionId` | Mark session as completed     |

### 👥 Multiplayer
| Method | Endpoint and Events       | Description                     |
|--------|---------------------------|---------------------------------|
| POST   | `/api/multiplayer-generate-room` | Create multiplayer room         |
---

## 🔌 WebSocket Events (Multiplayer)

- `join-room`
- `answer-question`
- `update-players`
- `game-over`

Handled inside `/socket/multiplayer.js`.

---

## 🧪 Testing

You can run unit and integration tests with:
```bash
npm test
```
