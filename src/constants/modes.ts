export const MAINTENANCE_MODE = {
  title: 'Maintenance Mode',
  description:
    'This mode helps you test and stabilize existing workloads and services within this grouper(Namespace) without worrying about unintended resource creation. By temporarily disabling new additions, your testing process becomes more controlled and less prone to disruption.',
  list: [
    'Creation of new resources is not allowed by default to avoid accidental rollouts as you can allow it (Not Recommended).',
    'Updates and deletions are allowed to give you control over existing instances during the lifecycle.',
  ],
  modalTitle: 'Maintenance Mode Settings',
  modalDescription:
    'Choose whether the current resources should be tolerated to be updated Or Deleted when this mode is enabled.',
  updateActionLabel: 'Allow Current Resources Updates',
  deleteActionLabel: 'Allow Current Resources Deletion',
  advancedOptionsLabel: 'Advanced Options',
  advancedOptionWorkloadLabel: 'Workloads',
  advancedOptionServiceLabel: 'Services',
  enableButtonLabel: 'Enable',
  updateButtonLabel: 'Update Settings',
  removeButtonLabel: 'Remove Mode',
  maintenanceActive: 'Maintenance Mode is Active',
  maintenanceStatusWarning: 'Maintenance mode is active. Updates and deletions are allowed.',
};

export const SYNC_MODE = {
  title: 'Sync Mode',
  description:
    'Manage the synchronization behavior of your resources within this grouper(Namespace). When enabled, Auto Sync ensures that your grouper periodically fetches the latest updates, keeping everything in sync automatically. In Manual Mode, updates are only applied when you explicitly trigger them, giving you more control over when changes are made.',
  list: [
    'Auto Sync Mode - will periodically fetch updates and automatically reconcile the state of your resources.',
    'Manual Mode - provides more control by requiring manual intervention to synchronize resources.',
  ],
  autoSyncLabel: 'Auto Sync Mode:',
  saveButtonLabel: 'Save Settings',
  autoSyncTextOn: 'On',
  autoSyncTextOff: 'Off',
  syncModeActive: 'Sync Mode is Active',
};
