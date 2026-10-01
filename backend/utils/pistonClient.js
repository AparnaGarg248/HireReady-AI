const JUDGE0_URL = process.env.JUDGE0_API_URL || "https://ce.judge0.com";

const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50
};

const LANGUAGE_VERSIONS = LANGUAGE_IDS;

const isPistonConfigured = () => true;

function buildHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (process.env.JUDGE0_RAPIDAPI_KEY) {
    headers["X-RapidAPI-Key"] = process.env.JUDGE0_RAPIDAPI_KEY;
    headers["X-RapidAPI-Host"] =
      process.env.JUDGE0_RAPIDAPI_HOST || "judge0-ce.p.rapidapi.com";
  }
  if (process.env.JUDGE0_AUTH_TOKEN) {
    headers["X-Auth-Token"] = process.env.JUDGE0_AUTH_TOKEN;
  }
  return headers;
}

function mapStatus(statusId, fallbackDescription) {
  if (statusId === 3) return "Accepted";
  if (statusId === 5) return "Time Limit Exceeded";
  if (statusId === 6) return "Compilation Error";
  if (statusId >= 7 && statusId <= 12) {
    return `Runtime Error (${fallbackDescription})`;
  }
  return fallbackDescription || "Unknown";
}

async function runOnPiston({ sourceCode, language, stdin }) {
  const languageId = LANGUAGE_IDS[language];
  if (!languageId) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const res = await fetch(
    `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
    {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        stdin: stdin || ""
      })
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Judge0 API error (${res.status}): ${errText}`);
  }

  const result = await res.json();
  const statusId = result.status?.id;

  if (statusId === 13 || statusId === 14) {
    throw new Error(
      `Judge0 internal error: ${result.message || result.status?.description}`
    );
  }

  return {
    stdout: result.stdout ?? "",
    stderr: result.stderr || "",
    compileOutput: result.compile_output || "",
    status: mapStatus(statusId, result.status?.description),
    time: result.time ? Number(result.time) : undefined,
    memory: result.memory
  };
}

module.exports = { runOnPiston, LANGUAGE_VERSIONS, isPistonConfigured };