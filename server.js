import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("VitDoc LLM Chatbot is running 🚀");
});

// Chat route
app.post("/chat", async (req, res) => {
  try {
    const { message, profile } = req.body;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY",
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
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// LOCAL RUN
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});