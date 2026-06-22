import type { ServerResponse } from 'node:http';

export type JsonValue = Record<string, unknown> | unknown[];

export function sendJson(res: ServerResponse, status: number, body: JsonValue): void {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
    'access-control-allow-headers': 'content-type, authorization',
  });
  res.end(JSON.stringify(body));
}

export function sendError(res: ServerResponse, status: number, code: string, message: string): void {
  sendJson(res, status, { error: { code, message } });
}
