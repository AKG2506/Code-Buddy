import Room from "../models/room.js";
import { v4 as uuidv4 } from "uuid";

export const createRoom = async (req, res) => {
  const { name } = req.body;
  const roomId = uuidv4();
  const room = new Room({ name, roomId });

  try {
    const result = await room.save();
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const save = async (req, res) => {
  const { body, input, language, roomId } = req.body;

  try {
    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ error: "Room not found" });

    room.body = body;
    room.input = input;
    room.language = language;

    await room.save();
    res.status(200).json({ message: "Saved" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Failed to save room" });
  }
};

export const saveWeb = async (req, res) => {
  const { html, js, css, roomId } = req.body;

  try {
    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ error: "Room not found" });

    room.html = html;
    room.css = css;
    room.js = js;

    const savedRoom = await room.save();
    res.status(200).json({ message: "Saved", room: savedRoom });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Failed to save room" });
  }
};

export const getRoomData = async (req, res) => {
  const { roomId } = req.body;

  try {
    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ error: "Room not found" });

    res.status(200).json(room);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Failed to fetch room" });
  }
};
