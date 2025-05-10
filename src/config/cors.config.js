const allowedOrigins = ["http://localhost:3000", "https://example.com"];
const corsOptions =  {
    origin: (origin, callback) => {
        // allow requests with no origin (like mobile apps or curl requests) and
        // if the origin is not in the list of allowed origins, return an error
        if(!origin || allowedOrigins.includes(origin)) callback(null, true);
        else callback(new Error("Not allowed by CORS"));
    }
}

export default corsOptions;