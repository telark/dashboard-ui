import React from 'react';
import { DEFAULT_COLORS } from '../../../constants';
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
          fontWeight: 600,
          fontSize: 16,
          color: DEFAULT_COLORS.TEXT_ON_SURFACE,
          marginBottom: subtitle ? 0 : 12,
        }}
      >
        {title}
      </div>
      {subtitle ? (
        <Typography.Paragraph
          className="app-section-subtitle"
          type="secondary"
          style={{
            margin: 0,
            marginBottom: 1,
            fontSize: 13,
            color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
          }}
        >
          {subtitle}
        </Typography.Paragraph>
      ) : null}
      <div className="app-section-content" style={{ marginTop: 0 }}>
        {content}
      </div>
    </div>
  );
};

export default Section;
