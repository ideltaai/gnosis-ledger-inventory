import { ref } from 'vue';

const storageKey = 'authToken';

export function getAuthToken(): string {
  return sessionStorage.getItem(storageKey) ?? '';
}

export const authToken = ref(getAuthToken());

export function setAuthToken(token: string): void {
  authToken.value = token;
  sessionStorage.setItem(storageKey, token);
}

export function clearAuthToken(): void {
  authToken.value = '';
  sessionStorage.removeItem(storageKey);
}
