import React from 'react';
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS, FORM_LABEL_GAP } from '../../../constants';
import { SETTINGS_CONSTANTS } from '../constants';

const { CONTENT } = SETTINGS_CONSTANTS;

export interface SettingsDetail {
  label: string;
  value: React.ReactNode;
}

interface SettingsFieldLabelProps {
  label: string;
  info?: string;
}

export const SettingsFieldLabel: React.FC<SettingsFieldLabelProps> = ({ label, info }) => (
  <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
    {label}
    {info ? (
      <Tooltip title={info}>
        <InfoCircleOutlined
          tabIndex={0}
          aria-label={info}
          style={{ color: DEFAULT_COLORS.TEXT_MUTED, cursor: 'help' }}
        />
      </Tooltip>
    ) : null}
  </div>
);

interface SettingsFieldProps extends SettingsFieldLabelProps {
  hint?: React.ReactNode;
  children: React.ReactNode;
}

// One label-to-control gap for the whole app, the same as panel form items.
export const SettingsField: React.FC<SettingsFieldProps> = ({ label, info, hint, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: FORM_LABEL_GAP }}>
    <SettingsFieldLabel label={label} info={info} />
    {hint ? <SettingsHint>{hint}</SettingsHint> : null}
    {children}
  </div>
);

export const SettingsHint: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: CONTENT.HINT_FONT_SIZE, color: DEFAULT_COLORS.TEXT_MUTED }}>
    {children}
  </div>
);

interface SettingsSubsectionHeaderProps {
  title: string;
  description?: React.ReactNode;
}

// The card header's own title and description metrics, one level down.
export const SettingsSubsectionHeader: React.FC<SettingsSubsectionHeaderProps> = ({
  title,
  description,
}) => (
  <div>
    <h4
      style={{
        margin: 0,
        fontSize: CONTENT.CARD_TITLE_FONT_SIZE,
        fontWeight: 600,
        color: DEFAULT_COLORS.TEXT_PRIMARY,
      }}
    >
      {title}
    </h4>
    {description ? (
      <p
        style={{
          margin: `${CONTENT.CARD_TITLE_TO_DESCRIPTION_GAP_PX}px 0 0`,
          fontSize: CONTENT.CARD_DESCRIPTION_FONT_SIZE,
          color: DEFAULT_COLORS.TEXT_MUTED,
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
    ) : null}
  </div>
);

export const SettingsDetails: React.FC<{ items: SettingsDetail[] }> = ({ items }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'max-content 1fr',
      columnGap: CONTENT.DETAILS_COLUMN_GAP,
      rowGap: CONTENT.DETAILS_ROW_GAP,
      alignItems: 'baseline',
    }}
  >
    {items.map((item) => (
      <React.Fragment key={item.label}>
        <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>{item.label}</span>
        <span>{item.value}</span>
      </React.Fragment>
    ))}
  </div>
);

export const SettingsDivider: React.FC = () => (
  <div style={{ borderTop: `1px solid ${DEFAULT_COLORS.BORDER_ELEVATED}` }} />
);
