export const AUTH_COOKIE_NAME = 'trashly_token';

/**
 * Sets the auth token into document cookie.
 * @param token - Raw JWT token
 * @param maxAgeSeconds - Expiration time in seconds
 */
export function setAuthCookie(token: string, maxAgeSeconds: number = 3600): void {
  if (typeof document === 'undefined') return;

  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

/**
 * Removes the auth cookie by expiring it immediately.
 */
export function removeAuthCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * Retrieves a cookie value by name on client-side.
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
  );
  return matches ? decodeURIComponent(matches[1]) : null;
}
