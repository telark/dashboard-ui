import React from 'react';
import { TRUNCATE_STYLE, getPillSurface } from '../../../constants';
import type { RowTagProps } from '../../../interfaces/layout/table';

const RowTag: React.FC<RowTagProps> = ({
  text,
  accent,
  fontSize = 12,
  capitalize = true,
  truncate = false,
  title,
}) => {
  return (
    <span
      style={{
        display: 'inline-block',
        ...getPillSurface(accent),
        padding: '2px 10px',
        borderRadius: 999,
        fontWeight: 700,
        fontSize,
        textTransform: capitalize ? 'capitalize' : 'none',
        ...(truncate
          ? { ...TRUNCATE_STYLE, maxWidth: '100%', boxSizing: 'border-box' as const }
          : {}),
      }}
      title={title ?? (truncate ? text : undefined)}
    >
      {text}
    </span>
  );
};

export default RowTag;
