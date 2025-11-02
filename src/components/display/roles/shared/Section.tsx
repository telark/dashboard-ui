import React from 'react';
import { Collapse, Typography } from 'antd';

interface SectionProps {
  title: string;
  subtitle?: string;
  content?: React.ReactNode;
  defaultActive?: boolean;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ title, subtitle, content, defaultActive = true, className }) => {
  return (
    <Collapse
      className={`app-section ${className || ''}`.trim()}
      bordered={false}
      defaultActiveKey={defaultActive ? ['section'] : []}
      size="small"
      style={{ background: 'transparent' }}
    >
      <Collapse.Panel header={<span style={{ fontWeight: 600 }}>{title}</span>} key="section">
        {subtitle ? (
          <Typography.Paragraph className="app-section-subtitle" type="secondary" style={{ margin: 0 }}>
            {subtitle}
          </Typography.Paragraph>
        ) : null}
        <div className="app-section-content" style={{ marginTop: 1 }}>{content}</div>
      </Collapse.Panel>
    </Collapse>
  );
};

export default Section;


