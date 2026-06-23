<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AppShell from '../components/app-shell.vue';
import PageHeader from '../components/page-header.vue';
import { createUser, listUsers, resetPassword, type CurrentUser } from '../api/auth-api';
import { currentUser, hasPermission } from '../auth-state';

const users = ref<CurrentUser[]>([]);
const error = ref('');
const form = ref({ organizationId: currentUser.value?.organizationId ?? '', name: '', email: '', password: 'ChangeMe123!', role: 'Standard User' });
async function load() { if (hasPermission('users:view')) users.value = await listUsers(); }
async function save() { await createUser(form.value); await load(); }
async function reset(user: CurrentUser) { await resetPassword(user.id, 'ChangeMe123!'); error.value = `Password reset for ${user.email}`; }
onMounted(load);
</script>

<template>
  <AppShell><PageHeader title="Users & Roles" subtitle="Manage internal NuePrint MVP users and permissions." />
    <section v-if="!hasPermission('users:view')" class="card placeholder-panel"><h2>Permission Required</h2><p>You need user-management permission to access this page.</p></section>
    <section v-else class="card form-card"><label>Organization ID<input v-model="form.organizationId" required /></label><label>Name<input v-model="form.name" required /></label><label>Email<input v-model="form.email" type="email" required /></label><label>Temporary Password<input v-model="form.password" required /></label><label>Role<select v-model="form.role"><option>Admin</option><option>Standard User</option><option>Viewer</option></select></label><button class="btn primary" type="button" @click="save">Create User</button></section>
    <p v-if="error" class="auth-error">{{ error }}</p><section v-if="users.length" class="card table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead><tbody><tr v-for="user in users" :key="user.id"><td>{{ user.name }}</td><td>{{ user.email }}</td><td>{{ user.role }}</td><td><button class="table-action" type="button" @click="reset(user)">Reset Password</button></td></tr></tbody></table></section>
  </AppShell>
</template>
