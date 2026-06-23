import { apiGet, apiPost } from '../http';

export type CurrentUser = { id: string; organizationId: string; name: string; email: string; role: string; permissions: string[] };
export async function login(email: string, password: string) { return apiPost<{ user: CurrentUser; token: string }>('/api/auth/login', { email, password }); }
export async function me() { return apiGet<{ user: CurrentUser }>('/api/auth/me'); }
export async function changePassword(currentPassword: string, newPassword: string) { return apiPost<{ ok: true }>('/api/auth/change-password', { currentPassword, newPassword }); }
export async function listUsers() { return apiGet<CurrentUser[]>('/api/users'); }
export async function createUser(input: { organizationId: string; name: string; email: string; password: string; role: string }) { return apiPost('/api/users', input); }
export async function resetPassword(userId: string, newPassword: string) { return apiPost('/api/auth/reset-password', { userId, newPassword }); }
