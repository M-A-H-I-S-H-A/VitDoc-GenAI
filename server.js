import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import fs from "fs";

const app = express();

app.use(cors());
app.use(express.json());

const frontendPath = path.join(process.cwd(), "frontend");

if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

app.get("/test", (req, res) => {
  res.send("VitDoc LLM Chatbot is running 🚀");
});

app.post("/chat", async (req, res) => {
  try {
    const { message, profile } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `User Profile: ${JSON.stringify(profile)}\nSymptoms: ${message}\nGive vitamin deficiency suggestions in a concise format. List only the top 3 most likely deficiencies with a one-line reason and one-line dietary fix for each. Keep it short and simple.`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("STATUS:", response.status);  // ADD THIS
console.log("DATA:", JSON.stringify(data));  // ADD THIS

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI";
    res.json({ reply });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});