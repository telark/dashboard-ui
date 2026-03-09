import React from 'react';
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
        style={{ fontWeight: 600, fontSize: 16, color: '#0B1F33', marginBottom: subtitle ? 2 : 12 }}
      >
        {title}
      </div>
      {subtitle ? (
        <Typography.Paragraph
          className="app-section-subtitle"
          type="secondary"
          style={{ margin: 0, marginBottom: 8, fontSize: 13, color: '#64748b' }}
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
