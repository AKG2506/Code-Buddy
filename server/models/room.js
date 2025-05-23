import mongoose from "mongoose";
const { Schema } = mongoose;
const roomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  body: {
    type: String,
    default: "",
  },
  html: {
    type: String,
  },
  css: { type: String },
  js: {
    type: String,
  },
  language: {
    type: String,
    default: "python",
  },
  input: {
    type: String,
    default: "",
  },
});

export default mongoose.model("Room", roomSchema);
