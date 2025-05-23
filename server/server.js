import express from "express";
import bodyParser from "body-parser";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import axios from "axios";
import roomRoutes from "./routes/room.js";
import { ACTIONS } from "./utils/Actions.js";
const app = express();
dotenv.config({ path: "./config/config.env" });

// middlewares

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// app.use(
//   cors({
//     origin: [process.env.CLIENT_URL],
//   })
// );
app.use(cors());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

// set routes
app.use("/api", roomRoutes);

// Set Port
const PORT = process.env.PORT||5000;
app.get("/", (req, res) => {
  res.send("Code Buddies API");
});

// Create http server
const server = http.createServer(app);

// Create socket server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const userSocketMap = {};
function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

// Socket Connection
io.on("connection", (socket) => {
  console.log("socket connected", socket.id);
  // Socket Events

  // Join Room Event
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    console.log(`${username} joined ${roomId}`);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      // Send Joined Client to other clients
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  // Body Change Event
  socket.on(ACTIONS.BODY_CHANGE, ({ roomId, body }) => {
    console.log("Body Change", body);
    socket.to(roomId).emit(ACTIONS.BODY_CHANGE, { body });
  });
  // Input Change Event
  socket.on(ACTIONS.INPUT_CHANGE, ({ roomId, input }) => {
    console.log("Input Change", input);
    socket.to(roomId).emit(ACTIONS.INPUT_CHANGE, { input });
  });
  // Output Change Event
  socket.on(ACTIONS.OUTPUT_CHANGE, ({ roomId, output }) => {
    console.log("Output Change", output);
    socket.to(roomId).emit(ACTIONS.OUTPUT_CHANGE, { output });
  });
  // Html change event
  socket.on(ACTIONS.HTML_CHANGE, ({ roomId, html }) => {
    console.log("Html Change", html);
    socket.to(roomId).emit(ACTIONS.HTML_CHANGE, { html });
  });
  // Css Change event
  socket.on(ACTIONS.CSS_CHANGE, ({ roomId, css }) => {
    console.log("Css Change", css);
    socket.to(roomId).emit(ACTIONS.CSS_CHANGE, { css });
  });
  // js change event
  socket.on(ACTIONS.JS_CHANGE, ({ roomId, js }) => {
    console.log("Javascript Change", js);
    socket.to(roomId).emit(ACTIONS.JS_CHANGE, { js });
  });

  // Language Change Event
  socket.on(ACTIONS.LANGUAGE_CHANGE, ({ roomId, language }) => {
    console.log("Language Change", language);
    socket.to(roomId).emit(ACTIONS.LANGUAGE_CHANGE, { language });
  });

  // Sync Code Event
  socket.on(
    ACTIONS.SYNC_CODE,
    ({ socketId, body, input, output, language, messages, html, css, js }) => {
      console.log(
        "Sync Change",
        body,
        input,
        output,
        html,
        css,
        js,
        language,
        socketId,
        messages
      );
      io.to(socketId).emit(ACTIONS.BODY_CHANGE, { body });
      io.to(socketId).emit(ACTIONS.INPUT_CHANGE, { input });
      io.to(socketId).emit(ACTIONS.OUTPUT_CHANGE, { output });
      io.to(socketId).emit(ACTIONS.HTML_CHANGE, { html });
      io.to(socketId).emit(ACTIONS.CSS_CHANGE, { css });
      io.to(socketId).emit(ACTIONS.JS_CHANGE, { js });
      io.to(socketId).emit(ACTIONS.LANGUAGE_CHANGE, { language });
      io.to(socketId).emit(ACTIONS.SYNC_MESSAGE, { messages });
    }
  );

  // Save Code Event
  socket.on(ACTIONS.SAVE, ({ roomId, socketId }) => {
    console.log("Save", roomId);
    socket.in(roomId).emit(ACTIONS.START_SAVING, { roomId, socketId });
  });
  // Saved Code Event
  socket.on(ACTIONS.SAVED, ({ roomId }) => {
    console.log("Saved", roomId);
    socket.in(roomId).emit(ACTIONS.STOP_SAVING, { roomId });
  });
  // Run Code Event
  socket.on(ACTIONS.RUN, ({ roomId, socketId }) => {
    console.log("Run", roomId);
    socket.in(roomId).emit(ACTIONS.START_RUNNING, { roomId, socketId });
  });
  // Runned Code Event
  socket.on(ACTIONS.RUNNED, ({ roomId }) => {
    console.log("Runned", roomId);
    socket.in(roomId).emit(ACTIONS.STOP_RUNNING, { roomId });
  });
  // Send Message Event
  socket.on(ACTIONS.SEND_MESSAGE, ({ message, roomId, socketId, username }) => {
    console.log("Send Message", message);
    socket
      .to(roomId)
      .emit(ACTIONS.RECEIVE_MESSAGE, { message, socketId, username });
  });
  // Typing Event
  socket.on(ACTIONS.TYPING, ({ roomId, username }) => {
    console.log("Typing", username);
    socket.in(roomId).emit(ACTIONS.TYPED, { username, roomId });
  });

  // Disconnect Event
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      // Remove user from room
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    console.log("socket disconnected", socket.id);
    socket.leave();
  });
});
app.post("/api/run", async (req, res) => {
  try {
    console.log(1);
    const response = await axios.post(
      "https://api.paiza.io/runners/create",
      req.body
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to run code" });
  }
});

app.get("/api/status", async (req, res) => {
  try {
    const { id } = req.query;
    const response = await axios.get(
      `https://api.paiza.io/runners/get_status?id=${id}&api_key=guest`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch status" });
  }
});

app.get("/api/output", async (req, res) => {
  try {
    const { id } = req.query;
    const response = await axios.get(
      `https://api.paiza.io/runners/get_details?id=${id}&api_key=guest`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch output" });
  }
});

// Connect to MongoDB
mongoose.set("strictQuery", true);

 mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((error) => console.log("MongoDB Error", error.message));
