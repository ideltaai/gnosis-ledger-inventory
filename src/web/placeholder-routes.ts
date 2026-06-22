import type { PlaceholderRoute } from './router';

export const placeholderRoutes: Record<string, PlaceholderRoute> = {
  '/inventory/allocations': route('Allocations', 'Review material reserved for active production jobs.', ['Open allocations', 'Job material commitments', 'Release and adjustment workflows']),
  '/inventory/roll-measurement': route('Roll Measurement', 'Calculate remaining length for roll media using shop-floor measurements.', ['Manual remaining length', 'Outer diameter and build thickness', 'Roll label preview']),
  '/jobs': route('Jobs', 'Track local NuePrint production jobs and material requirements.', ['Client name and job number', 'Due date and source', 'Future allocation planning'], 'Create Job', '/jobs/new'),
  '/jobs/new': route('Create Job', 'Create a local production job before allocating material.', ['Client details', 'Due date', 'Optional external reference']),
  '/jobs/select-for-allocation': route('Select Job for Allocation', 'Choose a job before reserving available inventory.', ['Job search', 'Material requirements', 'Allocation readiness']),
  '/pick-lists': route('Pick Lists', 'Pull job materials by bin, item, roll, or unit label.', ['Open pick lists', 'Bin sequence', 'Pull confirmation'], 'Create Pick List', '/pick-lists/new'),
  '/pick-lists/new': route('Create Pick List', 'Build a guided pick list from job allocations.', ['Job selection', 'Bin sequence', 'Label scan confirmation']),
  '/counts': route('Counts', 'Run cycle counts by bin, item, category, or location.', ['Bin counts', 'Item counts', 'Variance reason codes'], 'Start Count', '/counts/new'),
  '/counts/new': route('New Cycle Count', 'Count material and record variance reason codes.', ['Bin count', 'Item count', 'Variance review']),
  '/reports': route('Reports', 'Operational inventory reporting for shortages, low stock, and movement.', ['Low stock', 'Shortages', 'Ledger movement']),
  '/reports/low-stock': route('Low Stock Report', 'Review items below reorder thresholds once stock policies are configured.', ['Reorder thresholds', 'Vendor context', 'Recommended purchasing']),
  '/reports/shortages': route('Shortages Report', 'See jobs missing required material before production starts.', ['Job requirements', 'Available stock', 'Purchasing gaps']),
  '/machines': route('Machines', 'Prepare work-center visibility for printers, cutters, laminators, and finishing equipment.', ['Machine list', 'Material compatibility', 'Production readiness']),
  '/vendors': route('Vendors', 'Manage supplier records, vendor SKUs, and purchasing units.', ['Vendor contacts', 'Item pricing', 'Preferred suppliers']),
  '/settings': route('Settings', 'Configure system preferences for the standalone Gnosis Inventory MVP.', ['System settings', 'Imports', 'Optional integrations']),
  '/settings/system': route('System Settings', 'Configure PostgreSQL and local runtime settings.', ['Database connection', 'Environment checks', 'Local runtime status']),
  '/settings/system-health': route('System Health', 'Review API, database, and runtime readiness.', ['API status', 'Database status', 'Operational checks']),
  '/settings/integrations': route('Integrations', 'Optional adapters live here; core inventory workflows run without them.', ['Jira adapter', 'Vendor imports', 'Barcode hardware']),
  '/settings/import': route('Import Starting Inventory', 'Prepare a guided import flow for beginning balances and labels.', ['CSV upload', 'Bin mapping', 'Validation report']),
};

function route(title: string, description: string, bullets: string[], action = 'Back to Dashboard', actionHref = '/dashboard'): PlaceholderRoute {
  return { path: '', title, description, bullets, action, actionHref };
}
