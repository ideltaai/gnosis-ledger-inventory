const authTokenKey = 'authToken';

export function getAuthToken(): string | null {
  return sessionStorage.getItem(authTokenKey);
}

export function setAuthToken(token: string): void {
  sessionStorage.setItem(authTokenKey, token);
}

export function clearAuthToken(): void {
  sessionStorage.removeItem(authTokenKey);
}
