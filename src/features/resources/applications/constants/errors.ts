export const APPLICATIONS_ERROR_MESSAGES = {
  CLIENT: {
    FETCH_APPLICATIONS_FAILED: 'Failed to fetch applications',
    FETCH_INSIGHTS_FAILED: 'Failed to fetch application insights',
    FETCH_APPLICATION_DETAILS_FAILED: 'Failed to fetch application details',
    UPDATE_APPLICATION_FAILED: 'Failed to update application',
    DELETE_APPLICATION_FAILED: 'Failed to delete application',
    FETCH_APPLICATION_SNAPSHOTS_FAILED: 'Failed to fetch application snapshots',
    FETCH_SNAPSHOT_MANIFEST_FAILED: 'Failed to fetch snapshot manifest',
    TRIGGER_APPLICATION_ROLLBACK_FAILED: 'Failed to trigger application rollback',
    ABORT_APPLICATION_ROLLBACK_FAILED: 'Failed to abort application rollback',
  },
} as const;
