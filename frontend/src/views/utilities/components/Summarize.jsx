
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;


const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const summarizeNews = async (newsText) => {
    try {
      const response = await fetch(
API_URL ,        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Summarize the following news article : ${newsText}` }] }]
          }),
        }
      );
  
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate summary.";
    } catch (error) {
      return "Failed to summarize. Please try again.";
    }
  };
  
  export default summarizeNews;
  