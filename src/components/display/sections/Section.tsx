import React from 'react';
import { DEFAULT_COLORS, FONT_SIZE, FONT_WEIGHT, SPACING } from '../../../constants';
import { Typography } from 'antd';

interface SectionProps {
  title: string;
  subtitle?: string;
  content?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Section: React.FC<SectionProps> = ({ title, subtitle, content, className, style }) => {
  return (
    <div className={`app-section ${className || ''}`.trim()} style={{ width: '100%', ...style }}>
      <div
        style={{
          fontWeight: FONT_WEIGHT.SEMIBOLD,
          fontSize: FONT_SIZE.LG,
          color: DEFAULT_COLORS.TEXT_ON_SURFACE,
          marginBottom: subtitle ? SPACING.NONE : SPACING.MD,
        }}
      >
        {title}
      </div>
      {subtitle ? (
        <Typography.Paragraph
          type="secondary"
          style={{
            // Off scale, kept exact: -2 pulls the subtitle up to the title.
            margin: `-2px ${SPACING.NONE}px ${SPACING.XS}px`,
            fontSize: FONT_SIZE.MD,
            color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
          }}
        >
          {subtitle}
        </Typography.Paragraph>
      ) : null}
      <div style={{ marginTop: SPACING.SM }}>{content}</div>
    </div>
  );
};

export default Section;
