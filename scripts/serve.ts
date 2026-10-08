import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { repositoryRoot } from "./local.ts";
import { siteBase } from "./build-site.ts";

const root = path.resolve(repositoryRoot, "dist");
const port = Number(process.env["PORT"] ?? "4178");
const types: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};
const server = createServer((request, response) => {
  const respond = async () => {
    if (!["GET", "HEAD"].includes(request.method ?? "")) {
      response.writeHead(405).end();
      return;
    }
    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(request.url ?? "/", "http://127.0.0.1").pathname,
      );
    } catch {
      response.writeHead(400).end();
      return;
    }
    if (!pathname.startsWith(siteBase)) {
      response.writeHead(404).end();
      return;
    }
    const target = path.resolve(root, pathname.slice(siteBase.length));
    if (target !== root && !target.startsWith(root + path.sep)) {
      response.writeHead(404).end();
      return;
    }
    try {
      const entry = await stat(target);
      const file = entry.isDirectory()
        ? path.join(target, "index.html")
        : target;
      const bytes = await readFile(file);
      response.writeHead(200, {
        "Content-Type": types[path.extname(file)] ?? "application/octet-stream",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      });
      response.end(request.method === "HEAD" ? undefined : bytes);
    } catch {
      response.writeHead(404).end();
    }
  };
  void respond().catch(() => {
    response.writeHead(500).end();
  });
});
server.listen(port, "127.0.0.1", () => {
  console.log(`Preview at http://127.0.0.1:${String(port)}${siteBase}`);
});
for (const signal of ["SIGINT", "SIGTERM"] as const)
  process.on(signal, () => {
    server.close();
  });
