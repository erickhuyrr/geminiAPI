// server.js
import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();

// ---------------- CONFIG ----------------
const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ||
  "AIzaSyAhquh6oTNRStX7gvvr0y3H3hryVQWJeBc";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// ---------------- ROUTES ----------------

// Root endpoint
app.get("/", (req, res) => {
  res.send({
    success: true,
    message: "✅ Gemini API server is running!",
    usage: "/generate?prompt=Your+text+here",
  });
});

// GET /generate?prompt=hello+world
app.get("/generate", async (req, res) => {
  try {
    const prompt = (req.query.prompt || "").toString().trim();
    if (!prompt) {
      return res.status(400).send({
        success: false,
        error: "Missing 'prompt' query parameter",
        example: "/generate?prompt=Write+a+joke+about+coffee",
      });
    }

    // Call Gemini  
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // Clean formatted JSON output  
    res.send({
      success: true,
      model: "gemini-2.5-flash",
      prompt,
      output: response.text?.trim() || "(no text returned)",
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).send({
      success: false,
      error: "Gemini generation failed",
      message: err?.message || err,
    });
  }
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Gemini API running at http://localhost:${PORT}`);
});
