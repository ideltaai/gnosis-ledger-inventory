import { ref } from 'vue';

export const authToken = ref(sessionStorage.getItem('authToken') ?? '');
export function setAuthToken(token: string) { authToken.value = token; token ? sessionStorage.setItem('authToken', token) : sessionStorage.removeItem('authToken'); }
