import React from 'react';
import type { RowTagProps } from '../../../interfaces/layout/table';

const RowTag: React.FC<RowTagProps> = ({ text, background, color, fontSize = 12 }) => {
  return (
    <span
      style={{
        display: 'inline-block',
        background,
        color,
        padding: '2px 10px',
        borderRadius: 999,
        fontWeight: 700,
        fontSize,
        textTransform: 'capitalize',
      }}
    >
      {text}
    </span>
  );
};

export default RowTag;
