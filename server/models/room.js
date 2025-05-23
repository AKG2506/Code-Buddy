import mongoose from "mongoose";
// mongoose.connect('mongodb+srv://gupta2002akshat:nz1K1EW7ta2eTyFE@akshat.muoamja.mongodb.net/');

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
