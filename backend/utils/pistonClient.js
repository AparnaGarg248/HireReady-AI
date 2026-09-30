// ------------------------------------------------------------------
// Thin wrapper around the Piston API (https://emkc.org) for code
// execution. No API key or billing required - it's a free public
// service. Drop-in replacement for the old Judge0 client.
// ------------------------------------------------------------------

const PISTON_URL = process.env.PISTON_API_URL || "https://emkc.org/api/v2/piston";

// Maps our internal language keys to Piston's language + version.
// Full list: GET https://emkc.org/api/v2/piston/runtimes
const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  python: "3.10.0",
  java: "15.0.2",
  cpp: "10.2.0",
  c: "10.2.0"
};

// Piston needs no key, so this always returns true. Kept for API
// compatibility with the old isJudge0Configured() check.
const isPistonConfigured = () => true;

async function runOnPiston({ sourceCode, language, stdin }) {
  const version = LANGUAGE_VERSIONS[language];
  if (!version) {
    throw new Error(`Unsupported language for Piston: ${language}`);
  }

  const fileName = {
    javascript: "main.js",
    python: "main.py",
    java: "Main.java",
    cpp: "main.cpp",
    c: "main.c"
  }[language];

  const res = await fetch(`${PISTON_URL}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language,
      version,
      files: [{ name: fileName, content: sourceCode }],
      stdin: stdin || ""
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Piston API error (${res.status}): ${errText}`);
  }

  const result = await res.json();
  const { run, compile } = result;

  // Piston doesn't return a Judge0-style status string, so build a
  // comparable one from the exit code / compile step.
  let status = "Accepted";
  if (compile && compile.code !== 0) status = "Compilation Error";
  else if (run?.signal) status = `Runtime Error (${run.signal})`;
  else if (run?.code !== 0) status = "Runtime Error";

  return {
    stdout: run?.stdout ?? "",
    stderr: run?.stderr || compile?.stderr || "",
    compileOutput: compile?.output || "",
    status,
    time: run?.time,
    memory: run?.memory
  };
}

module.exports = { runOnPiston, LANGUAGE_VERSIONS, isPistonConfigured };
