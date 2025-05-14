const allowedOrigins = ["http://localhost:3000", "https://gamehub-sandy-nine.vercel.app/"];

const corsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200 // ensures legacy browsers don’t break
};


export default corsOptions;