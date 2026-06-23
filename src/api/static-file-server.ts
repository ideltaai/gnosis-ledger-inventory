import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { IncomingMessage, ServerResponse } from 'node:http';

const distDirectory = resolve(fileURLToPath(new URL('../../dist', import.meta.url)));
const indexFile = join(distDirectory, 'index.html');

const contentTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

function safeStaticPath(pathname: string): string | undefined {
  const decodedPath = decodeURIComponent(pathname.split('?')[0] ?? '/');
  const normalizedPath = normalize(decodedPath).replace(/^(\.\.[/\\])+/, '');
  const requestedPath = resolve(join(distDirectory, normalizedPath));
  return requestedPath.startsWith(distDirectory) ? requestedPath : undefined;
}

function sendFile(res: ServerResponse, filePath: string): void {
  const contentType = contentTypes[extname(filePath)] ?? 'application/octet-stream';
  res.writeHead(200, { 'content-type': contentType });
  createReadStream(filePath).pipe(res);
}

export function serveBuiltFrontend(req: IncomingMessage, res: ServerResponse, url: URL): boolean {
  if (url.pathname.startsWith('/api/')) return false;
  if (!existsSync(indexFile)) return false;

  const staticPath = safeStaticPath(url.pathname);
  if (staticPath && existsSync(staticPath) && statSync(staticPath).isFile()) {
    sendFile(res, staticPath);
    return true;
  }

  if (req.method === 'GET' || req.method === 'HEAD') {
    sendFile(res, indexFile);
    return true;
  }

  return false;
}
