import axios from "axios";

export const fetchGlobalNews = async (query) => {
  try {
    const res = await axios.get(`http://localhost:5050/news?query=${encodeURIComponent(query)}`);
    return res.data.results || [];
  } catch (err) {
    console.error("News fetch error:", err);
    return [];
  }
};
