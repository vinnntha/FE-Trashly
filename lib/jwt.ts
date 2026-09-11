export interface JwtPayload {
  sub: string;
  username: string;
  role: 'NASABAH' | 'ADMIN';
  iat?: number;
  exp?: number;
}

/**
 * Safely decodes a base64url encoded string in both browser and Node/Edge environments.
 */
function base64UrlDecode(str: string): string {
  // Convert base64url to base64
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // Pad with '='
  while (base64.length % 4) {
    base64 += '=';
  }

  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    const binaryStr = window.atob(base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  }

  // Node.js or Edge environment
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Decodes the JWT token payload without verifying the cryptographic signature
 * (signature verification is handled by backend API guards).
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payloadJson = base64UrlDecode(parts[1]);
    const payload = JSON.parse(payloadJson) as JwtPayload;

    if (!payload || typeof payload !== 'object') return null;
    return payload;
  } catch (error) {
    console.error('Failed to decode JWT token payload:', error);
    return null;
  }
}

/**
 * Checks if the JWT token has expired or is invalid.
 * @param token - Raw JWT string
 * @param bufferSeconds - Safety leeway in seconds before the actual exp timestamp (default 10s)
 */
export function isTokenExpired(token: string | null | undefined, bufferSeconds = 10): boolean {
  if (!token) return true;

  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) {
    // If there is no exp claim, consider it invalid for security
    return true;
  }

  const currentTimeSeconds = Math.floor(Date.now() / 1000);
  return payload.exp - bufferSeconds <= currentTimeSeconds;
}

/**
 * Calculates remaining time in seconds until the token expires.
 * Returns 0 if expired or invalid.
 */
export function getTokenRemainingSeconds(token: string | null | undefined): number {
  if (!token) return 0;

  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return 0;

  const currentTimeSeconds = Math.floor(Date.now() / 1000);
  const remaining = payload.exp - currentTimeSeconds;
  return remaining > 0 ? remaining : 0;
}

/**
 * Extracts verified role from token payload.
 * Prevents client-side tampering of localStorage user object.
 */
export function getTokenRole(token: string | null | undefined): 'NASABAH' | 'ADMIN' | null {
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  return payload?.role || null;
}
