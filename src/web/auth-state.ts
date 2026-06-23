import { computed, ref } from 'vue';
import { login as loginApi, me, type CurrentUser } from './api/auth-api';
import { clearAuthToken, getAuthToken, setAuthToken } from './auth-token-storage';

export const currentUser = ref<CurrentUser | null>(null);
export const authToken = ref(getAuthToken());
export const isAuthenticated = computed(() => !!authToken.value && !!currentUser.value);

export async function login(email: string, password: string) {
  const result = await loginApi(email, password);
  setAuthToken(result.token);
  authToken.value = result.token;
  currentUser.value = result.user;
}

export async function loadCurrentUser() {
  if (!getAuthToken()) return;
  try {
    currentUser.value = (await me()).user;
  } catch {
    logout();
  }
}

export function logout() {
  clearAuthToken();
  authToken.value = null;
  currentUser.value = null;
}

export function hasPermission(permission: string) {
  return currentUser.value?.permissions.includes(permission) ?? false;
}
