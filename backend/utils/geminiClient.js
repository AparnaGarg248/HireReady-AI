const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

const isGeminiConfigured = () => !!process.env.GEMINI_API_KEY;

async function askGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in backend/.env");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return text;
}

async function askGeminiForJSON(prompt) {
  const raw = await askGemini(prompt);
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error("Could not parse Gemini JSON response: " + err.message);
  }
}

module.exports = { askGemini, askGeminiForJSON, isGeminiConfigured };