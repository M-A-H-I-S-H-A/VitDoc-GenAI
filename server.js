import express from "express";
import cors from "cors";
import fetch from "node-fetch";
const app = express();

app.use(cors());
app.use(express.json());

import path from "path";

const frontendPath = path.join(process.cwd(), "frontend");

app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});
// OPTIONAL: Test route
app.get("/test", (req, res) => {
  res.send("VitDoc LLM Chatbot is running 🚀");
});
import fs from "fs";



if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Chat route
app.post("/chat", async (req, res) => {
  try {
    const { message, profile } = req.body;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBC5dezniWbynnCJKfqCdmd-LRpzIr_XBA",
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

// IMPORTANT: Use dynamic PORT for Railway
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});