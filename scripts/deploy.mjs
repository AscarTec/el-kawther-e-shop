// scripts/deploy.mjs
import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();

const distDir = path.join(projectRoot, "dist");

// غيّر المسار حسب مكان public_html عندك:
const targetDir = path.join(projectRoot, "public_html"); 
// مثال بديل شائع في الاستضافة: "/home/USERNAME/public_html"
// const targetDir = "/home/USERNAME/public_html";

function ensureSafePath(p) {
  const resolved = path.resolve(p);
  // ممنوع نهائيًا تمسح root أو home بالغلط
  const forbidden = ["/", "/home", "/var", "/usr", path.resolve(projectRoot)];
  if (forbidden.includes(resolved)) {
    throw new Error(`Refusing to deploy to unsafe path: ${resolved}`);
  }
  return resolved;
}

function existsDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function rmContents(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    fs.rmSync(full, { recursive: true, force: true });
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isSymbolicLink()) {
      // تجاهل الروابط لتجنب مشاكل على بعض الاستضافات
      continue;
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (!existsDir(distDir)) {
  throw new Error(`dist/ not found. Run "npm run build" first.`);
}

ensureSafePath(targetDir);

// جهّز target
fs.mkdirSync(targetDir, { recursive: true });

// امسح القديم (محتويات فقط)
rmContents(targetDir);

// انسخ الجديد
copyDir(distDir, targetDir);

console.log(`✅ Deployed dist -> ${targetDir}`);
