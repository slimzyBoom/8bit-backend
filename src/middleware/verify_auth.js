import { JWT_SECRET } from "../config/env.config.js";
import jwt from "jsonwebtoken";


const verifyAuth = (req, res, next) => {
    const token = req?.cookies?.token;
    if(!token) {
        return res.status(401).json({ error: "Unauthorized", success: false });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Server error: ", error)
        return res.status(401).json({ error: " Unauthorized ", success: false });
        
    }
}

export default verifyAuth;