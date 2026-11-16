import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve(process.cwd(), "out");
const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};

function resolveFilePath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0]);
  const safePath = path.normalize(cleanPath).replace(/^(\.\.[/\\])+/, "");
  const fullPath = path.join(OUT_DIR, safePath);

  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    return fullPath;
  }
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    const indexInDir = path.join(fullPath, "index.html");
    if (fs.existsSync(indexInDir)) return indexInDir;
  }
  const htmlFallback = `${fullPath}.html`;
  if (fs.existsSync(htmlFallback) && fs.statSync(htmlFallback).isFile()) {
    return htmlFallback;
  }
  return null;
}

const server = http.createServer((req, res) => {
  const reqPath = req.url || "/";
  const resolved = resolveFilePath(reqPath);
  const notFoundPath = path.join(OUT_DIR, "404.html");
  const filePath = resolved || (fs.existsSync(notFoundPath) ? notFoundPath : null);
  const statusCode = resolved ? 200 : 404;

  if (!filePath) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not Found");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const isImmutable =
    reqPath.startsWith("/_next/static/") || reqPath.startsWith("/images/");
  const cacheControl = isImmutable
    ? "public, max-age=31536000, immutable"
    : "public, max-age=300, stale-while-revalidate=86400";

  res.writeHead(statusCode, {
    "Content-Type": contentType,
    "Cache-Control": cacheControl,
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log(`Static server listening on http://${HOST}:${PORT}`);
});
