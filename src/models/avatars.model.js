import mongoose from "mongoose";

const avatarSync = mongoose.Schema({
    public_id: String,
    url : String,
})

export default mongoose.model("Avatar", avatarSync)