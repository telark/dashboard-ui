import React from 'react';
import { PanelHeader } from '../shared';

interface FilterPanelHeaderProps {
  onClose: () => void;
  title?: string;
}

const FilterPanelHeader: React.FC<FilterPanelHeaderProps> = ({ onClose, title = 'Filter' }) => {
  return <PanelHeader onClose={onClose} title={title} />;
};

export default FilterPanelHeader;
