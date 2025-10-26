// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Default route (test)
app.get("/", (req, res) => {
  res.send("Fii AI backend is running successfully 🚀");
});

// Chat route
// Replace the current /api/chat handler with this:

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // history is expected to be an array like:
    // [ { role: "user"|"assistant", content: "..." }, ... ]
    // We'll build messages with a system prompt first.
    const systemMsg = {
      role: "system",
      content:
        "You are Fii AI, a friendly fitness & yoga assistant. Give safe, clear, helpful, and concise advice. If the user asks for medical diagnosis, recommend consulting a healthcare professional."
    };

    const messages = Array.isArray(history) ? [...history] : [];
    // append the latest user message
    messages.push({ role: "user", content: message });

    // Final payload to model: system + conversation
    const payloadMessages = [systemMsg, ...messages];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // change model if needed
      messages: payloadMessages,
      max_tokens: 800,
      temperature: 0.7
    });

    const reply = completion.choices?.[0]?.message?.content ?? "Sorry, I couldn't respond.";

    // Return the assistant reply and optionally the message object for frontend
    res.json({
      reply,
      assistantMessage: { role: "assistant", content: reply }
    });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});





