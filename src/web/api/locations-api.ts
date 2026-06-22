import { apiGet, apiPost } from '../http';

export type Location = { id: string; name: string };
export type Bin = { id: string; code: string; location_id: string; active?: boolean };
export function listLocations(organizationId: string) {
  return apiGet<Location[]>(`/api/locations?organizationId=${organizationId}` as `/api/${string}`);
}
export function createLocation(organizationId: string, name: string) {
  return apiPost<Location>('/api/locations', { organizationId, name });
}
export function listBins(locationId: string) {
  return apiGet<Bin[]>(`/api/bins?locationId=${locationId}` as `/api/${string}`);
}
export function createBin(locationId: string, code?: string) {
  return apiPost<Bin>('/api/bins', { locationId, code });
}
