import React from 'react';
import { PanelHeader } from '../shared';

interface FilterPanelHeaderProps {
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

const FilterPanelHeader: React.FC<FilterPanelHeaderProps> = ({
  onClose,
  title = 'Filter',
  subtitle,
}) => {
  return <PanelHeader onClose={onClose} title={title} subtitle={subtitle} />;
};

export default FilterPanelHeader;
