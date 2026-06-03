import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Hashes a plain-text password using Node.js scrypt sync.
 * Returns a salt-prepended string: "salt:hash"
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifies a plain-text password against a salt-prepended hash.
 */
export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, originalHash] = combinedHash.split(":");
    if (!salt || !originalHash) return false;
    
    const verifyHash = scryptSync(password, salt, 64).toString("hex");
    return timingSafeEqual(Buffer.from(verifyHash, "hex"), Buffer.from(originalHash, "hex"));
  } catch {
    return false;
  }
}
