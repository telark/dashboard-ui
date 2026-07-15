import React, { memo } from 'react';
import { SlideOutPanel } from '../../../../../components/display/panels/slide-out';
import { APPLICATIONS_UI } from '../../constants';
import SnapshotManifestView from './SnapshotManifestView';
import type { SnapshotManifestState } from '../../models';

const MANIFEST_PANEL_WIDTH = 720;

export interface ApplicationSnapshotManifestSlideOutProps {
  open: boolean;
  manifestKey: string | null;
  onClose: () => void;
  title: string;
  manifestState: SnapshotManifestState | undefined;
}

/**
 * Slide-out wrapper around the manifest reader. The manage-snapshots panel shows
 * the reader inline instead; this stays for callers that open it standalone.
 */
const ApplicationSnapshotManifestSlideOut: React.FC<ApplicationSnapshotManifestSlideOutProps> =
  memo(({ open, manifestKey, onClose, title, manifestState }) => (
    <SlideOutPanel
      open={open}
      onClose={onClose}
      title={title.length > 0 ? title : APPLICATIONS_UI.FALLBACKS.EMPTY}
      subtitle={APPLICATIONS_UI.SECTIONS.SNAPSHOTS.MANIFEST_PANEL_SUBTITLE}
      width={MANIFEST_PANEL_WIDTH}
      contentOnly
      formContent={
        <SnapshotManifestView
          key={manifestKey ?? 'closed'}
          title={title}
          manifestState={manifestState}
        />
      }
    />
  ));

ApplicationSnapshotManifestSlideOut.displayName = 'ApplicationSnapshotManifestSlideOut';

export default ApplicationSnapshotManifestSlideOut;
