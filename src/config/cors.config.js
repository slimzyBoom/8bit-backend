const allowedOrigins = ["http://localhost:3000", "https://gamehub-sandy-nine.vercel.app/"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Don't throw an error that breaks OPTIONS — just reject it gracefully
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200 // ensures legacy browsers don’t break
};


export default corsOptions;