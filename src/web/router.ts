import { ref } from 'vue';

export type PlaceholderRoute = {
  path: string;
  title: string;
  description: string;
  action?: string;
  actionHref?: string;
  bullets: string[];
};

export const currentPath = ref(normalizePath(window.location.pathname));

export function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  currentPath.value = normalizePath(path);
}

function normalizePath(path: string) {
  return path === '/' ? '/dashboard' : path;
}

window.addEventListener('popstate', () => {
  currentPath.value = normalizePath(window.location.pathname);
});
