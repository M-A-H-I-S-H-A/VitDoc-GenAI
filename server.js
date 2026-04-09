import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend files
app.use(express.static(path.join(__dirname, "vitdoc frontend llm")));

// Show UI on homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "vitdoc frontend llm", "index.html"));
});

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { message, profile } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCp0NpfxlXeGXAMLh3cbQl5Q13ustJS_i0`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `User Profile: ${JSON.stringify(profile)}\nSymptoms: ${message}\nGive vitamin deficiency suggestions.`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";

    res.json({ reply });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
app.get("/", (req, res) => {
  res.send("VitDoc LLM Chatbot is running 🚀");
});