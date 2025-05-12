import mongoose from "mongoose";

const nationalitiesSchema = new mongoose.Schema({
  name: String,
  flag: String,
});

export default mongoose.model("Nationality", nationalitiesSchema);
