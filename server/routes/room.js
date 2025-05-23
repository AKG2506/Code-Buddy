import express from "express";

import { createRoom, save, getRoomData, saveWeb } from "../controllers/room.js";

const router = express.Router();

router.post("/createroom", createRoom);
router.post("/save", save);
router.post("/getroomdata", getRoomData);
router.post("/saveweb", saveWeb);

export default router;
