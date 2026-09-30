const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

async function extractResumeText(fullPath, fileType = "", fileName = "") {
  if (!fs.existsSync(fullPath)) return "";

  const type = (fileType || "").toLowerCase();
  const name = (fileName || "").toLowerCase();
  const isPdf = type.includes("pdf") || name.endsWith(".pdf");
  const isDocx =
    type.includes("wordprocessingml") ||
    name.endsWith(".docx");
  const isDoc = name.endsWith(".doc") && !isDocx;

  try {
    if(isPdf) {
      const buffer = fs.readFileSync(fullPath);
      const parsed = await pdfParse(buffer);
      return (parsed.text || "").trim();
    }

    if(isDocx) {
      const result = await mammoth.extractRawText({ path: fullPath });
      return (result.value || "").trim();
    }

    if(isDoc) {
      return "";
    }

    return "";
  } catch(err) {
    console.error("Resume text extraction failed:", err.message);
    return "";
  }
}

module.exports = { extractResumeText };