import React from 'react';
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import {
  DEFAULT_COLORS,
  FORM_LABEL_GAP,
  FONT_WEIGHT,
  LINE_HEIGHT,
  SPACING,
  KEYBOARD_TOOLTIP_TRIGGER,
} from '../../../constants';
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
  <div
    style={{ fontWeight: FONT_WEIGHT.BOLD, display: 'flex', alignItems: 'center', gap: SPACING.S6 }}
  >
    {label}
    {info ? (
      <Tooltip title={info} trigger={KEYBOARD_TOOLTIP_TRIGGER}>
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

// A label with its hint under it, as close as a card's description under its title.
const LabelWithHint: React.FC<Omit<SettingsFieldProps, 'children'>> = ({ label, info, hint }) => (
  <div style={{ minWidth: 0 }}>
    <SettingsFieldLabel label={label} info={info} />
    {hint ? (
      <div style={{ marginTop: CONTENT.CARD_TITLE_TO_DESCRIPTION_GAP_PX }}>
        <SettingsHint>{hint}</SettingsHint>
      </div>
    ) : null}
  </div>
);

// One label-to-control gap for the whole app, the same as panel form items.
export const SettingsField: React.FC<SettingsFieldProps> = ({ label, info, hint, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: FORM_LABEL_GAP }}>
    <LabelWithHint label={label} info={info} hint={hint} />
    {children}
  </div>
);

// A switch row: the label and its hint on the left, the switch (children) on the right.
export const SettingsToggle: React.FC<SettingsFieldProps> = ({ label, info, hint, children }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: SPACING.MD,
    }}
  >
    <LabelWithHint label={label} info={info} hint={hint} />
    {children}
  </div>
);

// The vertical rhythm inside a card: FIELD_GAP between fields, GROUP_GAP between groups.
export const SettingsStack: React.FC<{ groups?: boolean; children: React.ReactNode }> = ({
  groups = false,
  children,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: groups ? CONTENT.GROUP_GAP : CONTENT.FIELD_GAP,
    }}
  >
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

// The card header's own title and description metrics, one level down (h3 under the card's h2).
export const SettingsSubsectionHeader: React.FC<SettingsSubsectionHeaderProps> = ({
  title,
  description,
}) => (
  <div>
    <h3
      style={{
        margin: SPACING.NONE,
        fontSize: CONTENT.CARD_TITLE_FONT_SIZE,
        fontWeight: FONT_WEIGHT.SEMIBOLD,
        color: DEFAULT_COLORS.TEXT_PRIMARY,
      }}
    >
      {title}
    </h3>
    {description ? (
      <p
        style={{
          margin: `${CONTENT.CARD_TITLE_TO_DESCRIPTION_GAP_PX}px 0 0`,
          fontSize: CONTENT.CARD_DESCRIPTION_FONT_SIZE,
          color: DEFAULT_COLORS.TEXT_MUTED,
          lineHeight: LINE_HEIGHT.BASE,
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
