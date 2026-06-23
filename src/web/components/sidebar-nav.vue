<script setup lang="ts">
import AppLink from './app-link.vue';
import { currentUser, logout } from '../auth-state';
import { currentPath, navigateTo } from '../router';
const navItems = [
  ['Dashboard', '/dashboard', '▦'], ['Receiving', '/receiving', '⇩'], ['Inventory', '/inventory', '⬡'],
  ['Locations & Bins', '/locations', '⌖'], ['Jobs', '/jobs', '▣'], ['Pick Lists', '/pick-lists', '☑'],
  ['Counts', '/counts', '#'], ['Reports', '/reports', '▥'], ['Machines', '/machines', '⚙'],
  ['Vendors', '/vendors', '▱'], ['Settings', '/settings', '☷'],
];
</script>

<template>
  <aside class="sidebar">
    <div class="brand-block">
      <div class="brand-row"><span class="cmyk-mark"><i /><i /><i /></span><span>GNOSIS<br><em>INVENTORY</em></span></div>
      <div class="brand-divider" />
      <div class="client-mark"><span class="np-mark">NP</span><strong>NUEPRINT</strong></div>
      <p>NuePrint MVP</p>
    </div>
    <nav class="nav-list" aria-label="Main navigation">
      <AppLink v-for="item in navItems" :key="item[0]" :href="item[1]" class="nav-item" :class="{ active: currentPath === item[1] || (item[1] !== '/dashboard' && currentPath.startsWith(item[1])) }">
        <span>{{ item[2] }}</span>{{ item[0] }}
      </AppLink>
    </nav>
    <footer class="sidebar-footer">
      <div class="user-card"><span class="avatar">{{ currentUser?.name.slice(0, 2).toUpperCase() ?? 'GI' }}</span><span><strong>{{ currentUser?.name ?? 'User' }}</strong><small>{{ currentUser?.role ?? 'Signed In' }}</small></span></div>
      <button class="sign-out button-link" type="button" @click="logout(); navigateTo('/dashboard')">⇲ Sign Out</button>
      <div class="cmyk-footer"><i /><i /><i /><i /></div>
    </footer>
  </aside>
</template>
