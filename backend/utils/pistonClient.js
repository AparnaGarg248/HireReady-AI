const PISTON_URL = process.env.PISTON_API_URL || "https://emkc.org/api/v2/piston";

const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  python: "3.10.0",
  java: "15.0.2",
  cpp: "10.2.0",
  c: "10.2.0"
};

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