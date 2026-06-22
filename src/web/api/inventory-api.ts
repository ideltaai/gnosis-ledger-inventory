import { apiGet, apiPost } from '../http';

export type Item = { id: string; sku: string; name: string; category_id?: string; tracking_mode?: string; active?: boolean };
export type Category = { id: string; name: string; category_type?: string };
export type InventoryItemInput = { organizationId: string; sku: string; name: string; categoryId?: string; trackingMode: string; attributes?: Record<string, unknown> };

export function listItems(organizationId: string, search = '') {
  return apiGet<Item[]>(`/api/items?organizationId=${organizationId}&search=${encodeURIComponent(search)}` as `/api/${string}`);
}
export function listCategories(organizationId: string) {
  return apiGet<Category[]>(`/api/categories?organizationId=${organizationId}` as `/api/${string}`);
}
export function createItem(input: InventoryItemInput) {
  return apiPost<Item>('/api/items', input);
}
export function availability(itemId: string) {
  return apiGet<{ available: number; onHand: number }>(`/api/inventory/availability?itemId=${itemId}` as `/api/${string}`);
}
