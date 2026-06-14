import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}

function relPrefix(file) {
  const dir = path.dirname(path.relative(root, file));
  if (dir === ".") return "";
  return dir.split(path.sep).map(() => "..").join("/") + "/";
}

function localHref(prefix, value) {
  if (value === "/") return `${prefix}index.html`;
  if (value.startsWith("/assets/")) return `${prefix}${value.slice(1)}`;
  if (value.endsWith("/")) return `${prefix}${value.slice(1)}index.html`;
  return value;
}

const pages = (await walk(root)).filter((file) => file.endsWith("index.html"));

for (const page of pages) {
  const prefix = relPrefix(page);
  let html = await fs.readFile(page, "utf8");

  html = html.replace(/(href|src)="(\/(?!\/)[^"]*)"/g, (match, attr, value) => {
    if (value.startsWith("/assets/") || value === "/" || value.endsWith("/")) {
      return `${attr}="${localHref(prefix, value)}"`;
    }
    return match;
  });

  await fs.writeFile(page, html);
}

console.log(`Updated ${pages.length} pages for file:// browsing.`);
