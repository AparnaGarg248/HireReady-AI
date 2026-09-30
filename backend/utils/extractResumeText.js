const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

/**
 * Reads the resume file off disk and pulls out its plain text, based on
 * its mime type / extension. Returns "" if extraction isn't possible
 * (unsupported type, corrupted file, scanned/image-only PDF, etc.) so
 * callers can fall back gracefully instead of crashing.
 */
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
    if (isPdf) {
      const buffer = fs.readFileSync(fullPath);
      const parsed = await pdfParse(buffer);
      return (parsed.text || "").trim();
    }

    if (isDocx) {
      const result = await mammoth.extractRawText({ path: fullPath });
      return (result.value || "").trim();
    }

    if (isDoc) {
      // Legacy .doc binary format isn't supported by mammoth/pdf-parse.
      // Ask the user to re-save as .docx or .pdf instead of failing silently.
      return "";
    }

    return "";
  } catch (err) {
    console.error("Resume text extraction failed:", err.message);
    return "";
  }
}

module.exports = { extractResumeText };
