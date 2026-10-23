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
          className="app-section-subtitle"
          type="secondary"
          style={{
            // Off scale, kept exact: marginBottom 1 (NONE to XXS).
            margin: SPACING.NONE,
            marginBottom: 1,
            fontSize: FONT_SIZE.MD,
            color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
          }}
        >
          {subtitle}
        </Typography.Paragraph>
      ) : null}
      <div className="app-section-content" style={{ marginTop: SPACING.NONE }}>
        {content}
      </div>
    </div>
  );
};

export default Section;
