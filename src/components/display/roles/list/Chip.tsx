import React from 'react';

interface ChipProps {
  text: string;
  background: string;
  color: string;
  fontSize?: number;
}

const Chip: React.FC<ChipProps> = ({ text, background, color, fontSize = 12 }) => {
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

export default Chip;


