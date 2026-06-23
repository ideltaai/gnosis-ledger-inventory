import { computed, ref } from 'vue';
import { login as loginApi, me, type CurrentUser } from './api/auth-api';
import { authToken, setAuthToken } from './auth-token-storage';
export const currentUser = ref<CurrentUser | null>(null);
export const isAuthenticated = computed(() => !!authToken.value && !!currentUser.value);

export async function login(email: string, password: string) {
  const result = await loginApi(email, password);
  setAuthToken(result.token);
  currentUser.value = result.user;
}

export async function loadCurrentUser() {
  if (!authToken.value) return;
  try { currentUser.value = (await me()).user; } catch { logout(); }
}

export function logout() {
  setAuthToken('');
  currentUser.value = null;
}

export function hasPermission(permission: string) { return currentUser.value?.permissions.includes(permission) ?? false; }
