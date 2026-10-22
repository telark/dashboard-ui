import React, { useEffect } from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';
import { VIEW } from '../../../../../constants/layout/panels';
import { CapitalizeFirstLetter } from '../../../../../utils/helpers/format';
import { SlideOutPanel } from '../../../../../components/display/panels/slide-out';
import ViewPanelDetails from '../../../../../components/display/panels/view/ViewPanelDetails';
import type { ViewDetailRow } from '../../../../../components/display/panels/view/types';
import DateAndAge from '../DateAndAge';
import { APPLICATIONS_UI } from '../../../constants';
import { APPLICATION_CHANGE_LINE_PALETTE } from '../../../constants/sectionLayout';
import type { ApplicationChangeLogEntry } from '../../../models';
import ChangeLine from './ChangeLine';

const CL = APPLICATIONS_UI.SECTIONS.CHANGE_LOG;

const entryDetails = (entry: ApplicationChangeLogEntry, actorName: string): ViewDetailRow[] => {
  const rows: ViewDetailRow[] = [
    { label: CL.DETECTED_LABEL, value: <DateAndAge date={entry.detectedAt} /> },
  ];
  if (actorName) {
    rows.push({
      label: CL.CHANGED_BY_LABEL,
      value: <span title={entry.changedBy ?? undefined}>{actorName}</span>,
    });
  }
  if (entry.changeClass) {
    rows.push({ label: CL.CLASS_LABEL, value: CapitalizeFirstLetter(entry.changeClass) });
  }
  if (entry.severity) {
    rows.push({ label: CL.SEVERITY_LABEL, value: CapitalizeFirstLetter(entry.severity) });
  }
  rows.push({ label: CL.GEN, value: entry.generation });
  return rows;
};

// Read-only: every change of the entry, including the tracking annotations the row hides.
const ChangeEntryPanel: React.FC<{
  entry: ApplicationChangeLogEntry | null;
  actorName: string;
  onClose: () => void;
}> = ({ entry, actorName, onClose }) => {
  // The shared frame has no Escape key; a read-only panel loses nothing to it.
  useEffect(() => {
    if (!entry) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [entry, onClose]);

  const changes = entry?.changes ?? [];
  return (
    <SlideOutPanel
      open={entry != null}
      onClose={onClose}
      title={CL.PANEL_TITLE}
      contentOnly
      formContent={
        entry ? (
          <div style={{ ...VIEW.CONTAINER, color: DEFAULT_COLORS.TEXT_ON_SURFACE }}>
            <ViewPanelDetails details={entryDetails(entry, actorName)} />
            {changes.length ? (
              <div>
                <div style={VIEW.DETAILS.LABEL}>
                  {CL.CHANGES_LABEL}
                  <span style={VIEW.TAB_COUNT}>{changes.length}</span>
                </div>
                <div
                  // 10: the label-to-list gap sits between SM and MD.
                  style={{ marginTop: 10 }}
                >
                  {changes.map((c, idx) => (
                    <ChangeLine
                      key={`${entry.fingerprint}:${idx}`}
                      change={c}
                      first={idx === 0}
                      palette={APPLICATION_CHANGE_LINE_PALETTE.PANEL}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null
      }
    />
  );
};

export default ChangeEntryPanel;
