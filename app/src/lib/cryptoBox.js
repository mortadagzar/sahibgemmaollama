import crypto from 'node:crypto';

const algorithm = 'aes-256-gcm';

function getKey() {
  const secret = process.env.APP_TOKEN_SECRET || process.env.APP_DATABASE_SERVICE_KEY || 'development-token-secret';
  return crypto.createHash('sha256').update(secret).digest();
}

export function encryptJson(value) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, encrypted].map((part) => part.toString('base64')).join('.');
}

export function decryptJson(value) {
  const [ivText, tagText, encryptedText] = String(value || '').split('.');
  if (!ivText || !tagText || !encryptedText) return null;
  const decipher = crypto.createDecipheriv(algorithm, getKey(), Buffer.from(ivText, 'base64'));
  decipher.setAuthTag(Buffer.from(tagText, 'base64'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedText, 'base64')), decipher.final()]);
  return JSON.parse(decrypted.toString('utf8'));
}
