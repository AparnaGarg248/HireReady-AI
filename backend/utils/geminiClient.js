const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
const GEMINI_FALLBACK_MODEL =
  process.env.GEMINI_FALLBACK_MODEL || "gemini-flash-lite-latest";

const isGeminiConfigured = () => !!process.env.GEMINI_API_KEY;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function callModel(model, prompt, apiKey, retries = 3) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    const errText = await response.text();
    const retryable = response.status === 429 || response.status === 503;

    if (retryable && attempt < retries) {
      await sleep(1000 * 2 ** attempt);
      continue;
    }

    const err = new Error(`Gemini API error (${response.status}): ${errText}`);
    err.status = response.status;
    throw err;
  }
}

async function askGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in backend/.env");
  }

  try {
    return await callModel(GEMINI_MODEL, prompt, apiKey);
  } catch (err) {
    const overloaded = err.status === 503 || err.status === 429;
    if (overloaded && GEMINI_FALLBACK_MODEL !== GEMINI_MODEL) {
      console.warn(`${GEMINI_MODEL} unavailable, falling back to ${GEMINI_FALLBACK_MODEL}`);
      return await callModel(GEMINI_FALLBACK_MODEL, prompt, apiKey);
    }
    throw err;
  }
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