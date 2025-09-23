import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// ✅ Enable CORS so React can fetch
app.use(cors());

// Endpoint for news
app.get("/news", async (req, res) => {
  try {
    const response = await fetch(
      `https://newsdata.io/api/1/news?apikey=${process.env.NEWS_API_KEY}&country=in&language=en&category=top`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch news" });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));

