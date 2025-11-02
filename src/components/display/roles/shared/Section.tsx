import React from 'react';
import { Typography } from 'antd';

interface SectionProps {
  title: string;
  subtitle?: string;
  content?: React.ReactNode;
  defaultActive?: boolean;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ title, subtitle, content, className }) => {
  return (
    <div className={`app-section ${className || ''}`.trim()}>
      <div style={{ fontWeight: 600 }}>{title}</div>
      {subtitle ? (
        <Typography.Paragraph className="app-section-subtitle" type="secondary" style={{ margin: 0 }}>
          {subtitle}
        </Typography.Paragraph>
      ) : null}
      <div className="app-section-content" style={{ marginTop: 1 }}>{content}</div>
    </div>
  );
};

export default Section;


