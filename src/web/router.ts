import { ref } from 'vue';

export type PlaceholderRoute = {
  path: string;
  title: string;
  description: string;
  action?: string;
  actionHref?: string;
  bullets?: string[];
};

export const currentPath = ref(window.location.pathname === '/' ? '/dashboard' : window.location.pathname);

export function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  currentPath.value = path === '/' ? '/dashboard' : path;
}

window.addEventListener('popstate', () => {
  currentPath.value = window.location.pathname === '/' ? '/dashboard' : window.location.pathname;
});
