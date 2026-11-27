// Gives css/site.css and js/site.js a new ?v= number in every page, so browsers fetch the new files
// instead of an old cached copy. Runs after `npm run build`.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const version = Date.now().toString().slice(0, 10);
const pages = ["index.html", "thanks.html", ...readdirSync("projects").map(f => `projects/${f}`)].filter(f => f.endsWith(".html"));

for (const page of pages) {
  const html = readFileSync(page, "utf8");
  const updated = html.replace(/(site\.(?:css|js))\?v=\d+/g, `$1?v=${version}`);
  if (updated !== html) writeFileSync(page, updated);
}
console.log(`Set ?v=${version} in ${pages.length} pages`);
