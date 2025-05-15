const allowedOrigins = ["http://localhost:3000", "http://localhost:5173", "https://gamehub-sandy-nine.vercel.app"];

const corsOptions = {
  origin: (origin, callback) => {
    // Check if the origin is in the allowedOrigins array
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error("Not allowed by CORS")); // Block the request
    }
  },
  credentials: true,
  optionsSuccessStatus: 200 // ensures legacy browsers don’t break
};


export default corsOptions;