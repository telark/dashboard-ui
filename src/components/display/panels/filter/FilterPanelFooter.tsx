import React from 'react';
import { PanelFooter } from '../shared';

interface FilterPanelFooterProps {
  onReset: () => void;
  onApply: () => void;
}

const FilterPanelFooter: React.FC<FilterPanelFooterProps> = ({ onReset, onApply }) => {
  return (
    <PanelFooter
      onCancel={onReset}
      onPrimary={onApply}
      cancelLabel="Reset"
      primaryLabel="Apply"
    />
  );
};

export default FilterPanelFooter;
