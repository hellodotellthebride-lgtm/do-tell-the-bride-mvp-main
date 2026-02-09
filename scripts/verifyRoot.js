const fs = require("fs");
const path = require("path");

function exists(name) {
  return fs.existsSync(path.join(process.cwd(), name));
}

const required = ["package.json", "app.json"];
const missing = required.filter((f) => !exists(f));

if (missing.length) {
  console.error("❌ You are not in the project root.");
  console.error("Missing:", missing.join(", "));
  console.error("Current directory:", process.cwd());
  console.error("Tip: cd into the folder that contains package.json, then try again.");
  process.exit(1);
}

console.log("✅ Project root confirmed:", process.cwd());
