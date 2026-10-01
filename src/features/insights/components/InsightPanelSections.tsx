import React, { useState } from 'react';
import { AiOutlineInfoCircle, AiOutlineRight } from 'react-icons/ai';
import { DEFAULT_COLORS } from '../../../constants';
import { useElementWidth } from '../../../hooks/layout';
import { CLUSTER_INSIGHTS, INSIGHT_SEVERITY_LABELS, SEVERITY_COLORS } from '../constants/insights';
import type { InsightSeverity } from '../models';

// The panel is a light surface: TEXT_ON_SURFACE*, never TEXT_PRIMARY (white). No shadows:
// cards read as raised through a hairline border.
export const textStyle: React.CSSProperties = {
  fontSize: 13,
  color: DEFAULT_COLORS.TEXT_ON_SURFACE,
  lineHeight: 1.55,
};
export const mutedStyle: React.CSSProperties = {
  fontSize: 12,
  color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
};
export const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
};
// A field's value right under its label.
const valueStyle: React.CSSProperties = { ...textStyle, lineHeight: 1.4 };
export const oneLine: React.CSSProperties = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};
const hairline = `1px solid ${DEFAULT_COLORS.SURFACE_BORDER_LIGHT}`;
export const cardStyle: React.CSSProperties = {
  border: hairline,
  borderRadius: 12,
  background: DEFAULT_COLORS.SURFACE_WHITE,
};
export const tilesStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '12px 16px',
  padding: 14,
  borderRadius: 10,
  background: DEFAULT_COLORS.CHIP_ON_SURFACE_BG,
};
// One line of the 17px title; the row's icon buttons center on it.
const TITLE_LINE_PX = 22;
const iconStyle: React.CSSProperties = { display: 'inline-flex', fontSize: 14 };

export const Fact: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({
  label,
  hint,
  children,
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
    <span style={labelStyle}>{label}</span>
    <span style={{ ...valueStyle, ...oneLine }} title={hint}>
      {children}
    </span>
  </div>
);

const SectionTitle: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <span style={{ ...labelStyle, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
    <span style={iconStyle}>{icon}</span>
    {label}
  </span>
);

export const Section: React.FC<{
  icon: React.ReactNode;
  label: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}> = ({ icon, label, extra, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <SectionTitle icon={icon} label={label} />
      {extra}
    </div>
    {children}
  </div>
);

// One card: the title, its pills and actions, what happened, then where and when.
export const InsightCard: React.FC<{
  title: string;
  chips: React.ReactNode;
  summary: string;
  facts: React.ReactNode;
  milestones: Milestone[];
  actions: React.ReactNode;
}> = ({ title, chips, summary, facts, milestones, actions }) => {
  // Measured, not the expand flag: the panel animates its width, and the pills must only join
  // the title's line once the card is really wider than the narrow panel.
  const { ref, width } = useElementWidth<HTMLDivElement>();
  const wide = width > CLUSTER_INSIGHTS.PANEL_WIDTH;
  const pills = <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 6 }}>{chips}</span>;
  return (
    <div ref={ref} style={cardStyle}>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* The actions are centered on the title's first line and never move with the wrap.
          Narrow: the pills go under the title. Wide: they follow it on its line. */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '6px 10px',
              }}
            >
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  lineHeight: `${TITLE_LINE_PX}px`,
                  color: DEFAULT_COLORS.TEXT_ON_SURFACE,
                }}
              >
                {title}
              </span>
              {wide ? pills : null}
            </div>
            {actions ? (
              <div
                style={{
                  height: TITLE_LINE_PX,
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                {actions}
              </div>
            ) : null}
          </div>
          {wide ? null : pills}
        </div>
        <div style={textStyle}>{summary}</div>
      </div>
      <div style={rowGridStyle(3)}>{facts}</div>
      <Timeline milestones={milestones} />
    </div>
  );
};

export interface Milestone {
  label: string;
  value: React.ReactNode;
  // Reached milestones get a solid dot in `color`; a pending one stays hollow.
  reached: boolean;
  color: string;
}

const rowGridStyle = (columns: number): React.CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
  gap: 16,
  padding: '8px 16px',
});

// When it happened: each time over a dot on a rail, dashed up to a milestone not reached yet.
const Timeline: React.FC<{ milestones: Milestone[] }> = ({ milestones }) => (
  <div style={rowGridStyle(milestones.length)}>
    {milestones.map((m, i) => (
      <div key={m.label} style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span style={labelStyle}>{m.label}</span>
        <span style={{ ...valueStyle, ...oneLine }}>{m.value}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
          <span
            style={{
              width: 10,
              height: 10,
              flexShrink: 0,
              borderRadius: '50%',
              boxSizing: 'border-box',
              background: m.reached ? m.color : DEFAULT_COLORS.SURFACE_WHITE,
              border: `2px solid ${m.reached ? m.color : DEFAULT_COLORS.SURFACE_BORDER}`,
            }}
          />
          {i < milestones.length - 1 ? (
            // Runs through the column gap to the next dot; dashed until that milestone is reached.
            <span
              style={{
                flex: 1,
                marginRight: -16,
                borderTop: `2px ${milestones[i + 1].reached ? 'solid' : 'dashed'} ${DEFAULT_COLORS.SURFACE_BORDER}`,
              }}
            />
          ) : null}
        </div>
      </div>
    ))}
  </div>
);

// Numbered steps joined by a rail, like a checklist to work down.
export const Steps: React.FC<{ steps: React.ReactNode[]; note?: string }> = ({ steps, note }) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    {steps.map((step, i) => (
      <div key={i} style={{ display: 'flex', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span
            style={{
              width: 22,
              height: 22,
              flexShrink: 0,
              borderRadius: '50%',
              background: DEFAULT_COLORS.CHIP_ON_SURFACE_BG,
              border: hairline,
              color: DEFAULT_COLORS.TEXT_ON_SURFACE,
              fontSize: 11,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {i + 1}
          </span>
          {i < steps.length - 1 ? (
            <span style={{ flex: 1, width: 1, background: DEFAULT_COLORS.SURFACE_BORDER }} />
          ) : null}
        </div>
        <div style={{ ...textStyle, paddingTop: 1, paddingBottom: i < steps.length - 1 ? 12 : 0 }}>
          {step}
        </div>
      </div>
    ))}
    {note ? (
      <div
        style={{
          ...mutedStyle,
          marginTop: 12,
          padding: '8px 10px',
          borderRadius: 8,
          background: DEFAULT_COLORS.CHIP_ON_SURFACE_BG,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={iconStyle}>
          <AiOutlineInfoCircle />
        </span>
        {note}
      </div>
    ) : null}
  </div>
);

export const FindingRow: React.FC<{
  severity: InsightSeverity;
  title: string;
  trailing?: string;
  onClick: () => void;
}> = ({ severity, title, trailing, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        all: 'unset',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minWidth: 0,
        padding: '8px 10px',
        borderRadius: 8,
        background: hovered ? DEFAULT_COLORS.SURFACE_HOVER : 'transparent',
      }}
    >
      <span
        aria-label={INSIGHT_SEVERITY_LABELS[severity]}
        style={{
          background: SEVERITY_COLORS[severity],
          width: 8,
          height: 8,
          flexShrink: 0,
          borderRadius: '50%',
        }}
      />
      <span style={{ ...textStyle, ...oneLine, flex: 1 }}>{title}</span>
      {trailing ? <span style={mutedStyle}>{trailing}</span> : null}
      <span style={{ ...iconStyle, color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED }}>
        <AiOutlineRight />
      </span>
    </button>
  );
};
