// const mongoose = require("mongoose");
// const MONGO_URI = process.env.MONGO_URI;

// export const connectDB = async () => {
//     try {
//         await mongoose.connect(MONGO_URI)
//         console.log("Database connected successfully")
//     } catch (error) {
//         console.log(`Error connecting to DB: ${error.message}`)
//         process.exit(1);
//     }
// }

// module.exports = connectDB;

// ✅ CommonJS
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
