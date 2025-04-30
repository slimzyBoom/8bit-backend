require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db.config");

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
