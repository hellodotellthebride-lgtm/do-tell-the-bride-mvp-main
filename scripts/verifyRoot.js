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

// Helpful sanity checks so we fail fast with a clear message instead of a 500 in Expo Go.
const expectedNodeMajors = new Set([18, 20]);
const nodeMajor = Number((process.versions?.node || "").split(".")[0]);
if (Number.isFinite(nodeMajor) && !expectedNodeMajors.has(nodeMajor)) {
  console.warn(
    `⚠️  Node ${process.versions.node} detected. This project expects Node 18 or 20 (see package.json "engines" and .nvmrc).`,
  );
  console.warn("   Tip: run `nvm use` in this folder, then try again.");
}

const expoPackageJson = path.join(process.cwd(), "node_modules", "expo", "package.json");
if (!fs.existsSync(expoPackageJson)) {
  console.error("❌ Dependencies are not installed (missing node_modules/expo).");
  console.error("   Fix: run `npm install` (or `npm ci`), then try again.");
  process.exit(1);
}

console.log("✅ Project root confirmed:", process.cwd());
