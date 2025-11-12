// api/index.js
import { GoogleGenAI } from "@google/genai";

// ---------------- CONFIG ----------------
// Add your Gemini API key here
const GEMINI_API_KEY = "AIzaSyAhquh6oTNRStX7gvvr0y3H3hryVQWJeBc";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// ---------------- SERVERLESS FUNCTION ----------------
export default async function handler(req, res) {
  const { prompt } = req.query;

  if (!prompt) {
    return res.status(400).json({
      success: false,
      error: "Missing 'prompt' query parameter",
      example: "/generate?prompt=Write+a+joke",
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.status(200).json({
      success: true,
      model: "gemini-2.5-flash",
      prompt,
      output: response.text?.trim() || "(no text returned)",
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Gemini generation failed",
      message: err?.message || err,
    });
  }
}
