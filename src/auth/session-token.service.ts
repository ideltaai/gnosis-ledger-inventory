import { createHmac, timingSafeEqual } from 'node:crypto';

type TokenPayload = { userId: string; role: string; permissions: string[]; exp: number };

function secret() { return process.env.AUTH_TOKEN_SECRET ?? 'local-dev-auth-secret-change-me'; }
function encode(input: unknown) { return Buffer.from(JSON.stringify(input)).toString('base64url'); }
function sign(data: string) { return createHmac('sha256', secret()).update(data).digest('base64url'); }

export function createSessionToken(payload: Omit<TokenPayload, 'exp'>): string {
  const body = encode({ ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12 });
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(token: string): TokenPayload | undefined {
  const [body, signature] = token.split('.');
  if (!body || !signature) return undefined;
  const expected = sign(body);
  const valid = timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as TokenPayload;
  return valid && payload.exp > Math.floor(Date.now() / 1000) ? payload : undefined;
}
