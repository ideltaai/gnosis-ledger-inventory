import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const keyLength = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('base64url');
  const derived = (await scrypt(password, salt, keyLength)) as Buffer;
  return `scrypt$${salt}$${derived.toString('base64url')}`;
}

export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const [scheme, salt, stored] = encoded.split('$');
  if (scheme !== 'scrypt' || !salt || !stored) return false;
  const derived = (await scrypt(password, salt, keyLength)) as Buffer;
  const storedBuffer = Buffer.from(stored, 'base64url');
  return storedBuffer.length === derived.length && timingSafeEqual(storedBuffer, derived);
}
