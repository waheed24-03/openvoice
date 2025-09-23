// File: src/services/newsApi.js
import axios from "axios";

const API_KEY = "pub_95aa3c0b66a14ce9b3588c6f7f115832"; // NewsData.io key
const BASE_URL = "https://newsdata.io/api/1/news";

export const fetchGlobalNews = async (
  query = "Palestine OR Sudan OR Congo OR Uyghur OR Gaza OR Rohingya OR Kashmir OR Myanmar OR Syria"
) => {
  try {
    const res = await axios.get(BASE_URL, {
      params: {
        apikey: API_KEY,
        q: query,
        language: "en",
        country: "us,gb,ae,qa,pk,in,ca,au", // Wider coverage
        category: "top",
        size: 20,
      },
    });

    // NewsData.io returns results in res.data.results
    return res.data.results || [];
  } catch (err) {
    console.error("News API error:", err);
    return [];
  }
};
