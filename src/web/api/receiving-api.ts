import { apiPost } from '../http';

export type ReceiptInput = { organizationId: string; itemId: string; binId: string; quantity: number; reference?: string };
export function receiveInventory(input: ReceiptInput) {
  return apiPost<{ unitId: string; ledgerId: string; auditId: string }>('/api/receiving', input);
}
