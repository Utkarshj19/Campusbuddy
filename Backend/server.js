import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Memory from "./models/Memory.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.error("MongoDB Error ❌", err));

app.get("/", (req, res) => {
  res.send("Campus Buddy Gemini API is running 🚀");
});

// 🧠 Chat endpoint using Gemini
app.post("/api/chat", async (req, res) => {
  try {
    const { userId, message } = req.body;

    const userMemory = await Memory.findOne({ userId });
    const history = userMemory ? userMemory.messages : [];

    const conversationText = [
      "You are Campus Buddy, a friendly student assistant.",
      ...history.map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`),
      `User: ${message}`,
      "Assistant:"
    ].join("\n");

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: conversationText }] }]
        }),
      }
    );

    const data = await geminiResponse.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    const updatedMessages = [
      ...history,
      { role: "user", content: message },
      { role: "assistant", content: reply },
    ];

    await Memory.findOneAndUpdate(
      { userId },
      { messages: updatedMessages },
      { upsert: true, new: true }
    );

    res.json({ reply });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
