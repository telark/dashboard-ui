import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';
import RowTag from '../../../../../components/display/table/RowTag';
import SettingsCard from '../../../../settings/components/SettingsCard';

export interface ApplicationOverviewRow {
  k: string;
  label: string;
  value: React.ReactNode;
}

export interface ApplicationNamespaceRow {
  name: string;
  resourceCount: number;
}

export interface ApplicationOverviewProps {
  title: string;
  description: string;
  overviewTitle: string;
  namespacesTitle: string;
  namespaces: ApplicationNamespaceRow[];
  onEmptyNamespacesLabel: string;
  children?: React.ReactNode;
}

const OVERVIEW_RESOURCE_COLUMN_LABEL_STYLE: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: DEFAULT_COLORS.TEXT_MUTED,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: 10,
};

const ApplicationOverview: React.FC<ApplicationOverviewProps> = memo(
  ({
    title,
    description,
    overviewTitle,
    namespacesTitle,
    namespaces,
    onEmptyNamespacesLabel,
    children,
  }) => {
    return (
      <SettingsCard title={title} description={description}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 24,
            alignItems: 'start',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={OVERVIEW_RESOURCE_COLUMN_LABEL_STYLE}>{overviewTitle}</div>
            {children}
            <div style={{ marginTop: 10 }}>
              <div style={OVERVIEW_RESOURCE_COLUMN_LABEL_STYLE}>{namespacesTitle}</div>
              {namespaces.length === 0 ? (
                <div style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_MUTED }}>
                  {onEmptyNamespacesLabel}
                </div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {namespaces.map((ns) => (
                    <RowTag
                      key={ns.name}
                      text={`${ns.name} (${ns.resourceCount})`}
                      background={DEFAULT_COLORS.CHIP_BLUE_BG}
                      color={DEFAULT_COLORS.CHIP_BLUE_TEXT}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </SettingsCard>
    );
  },
);

ApplicationOverview.displayName = 'ApplicationOverview';

export default ApplicationOverview;
