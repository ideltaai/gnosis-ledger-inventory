<script setup lang="ts">
import { ref } from 'vue';
import { login } from '../auth-state';

const email = ref('admin@nueprint.local');
const password = ref('ChangeMe123!');
const error = ref('');
async function submit() {
  error.value = '';
  try { await login(email.value, password.value); } catch { error.value = 'Invalid email or password.'; }
}
</script>

<template>
  <main class="login-shell">
    <section class="card login-card"><div class="brand-row"><span class="cmyk-mark"><i /><i /><i /></span><span>GNOSIS<br><em>INVENTORY</em></span></div><p>NuePrint MVP</p>
      <h1>Sign in</h1><p>Internal inventory access only</p><form @submit.prevent="submit"><label>Email<input v-model="email" type="email" required /></label><label>Password<input v-model="password" type="password" required /></label><button class="btn primary" type="submit">Sign In</button></form><p v-if="error" class="auth-error">{{ error }}</p><small>Default local admin: admin@nueprint.local / ChangeMe123!</small></section>
  </main>
</template>
