import React from 'react';
import { Space } from 'antd';
import { ROLES_CONSTANTS as RC } from '../../../../roles/constants';
import { ATTACHED_ROLES_CONSTANTS as ARC } from '../../../constants';
import { FilterButton } from '../../../../../../components/display/buttons';

interface RoleTypeFilterProps {
  selectedRoleType: string;
  onTypeChange: (type: string) => void;
  onFilterClick?: () => void;
}

const RoleTypeFilter: React.FC<RoleTypeFilterProps> = ({
  selectedRoleType,
  onTypeChange,
  onFilterClick,
}) => {
  const handleTypeChange = (type: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onTypeChange(type);
  };

  const getButtonStyle = (isActive: boolean) => ({
    ...ARC.FILTER.BUTTON.BASE,
    ...(isActive ? ARC.FILTER.BUTTON.ACTIVE : ARC.FILTER.BUTTON.INACTIVE),
  });

  return (
    <div style={ARC.FILTER.CONTAINER}>
      <span style={ARC.FILTER.LABEL}>Role Type</span>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Space wrap={false} size={[8, 8]}>
          <button
            type="button"
            onClick={handleTypeChange('all')}
            style={getButtonStyle(selectedRoleType === 'all')}
          >
            All
          </button>
          <button
            type="button"
            onClick={handleTypeChange(RC.VALUES.ROLE_TYPE_BUILT_IN)}
            style={getButtonStyle(selectedRoleType === RC.VALUES.ROLE_TYPE_BUILT_IN)}
          >
            Built-in
          </button>
          <button
            type="button"
            onClick={handleTypeChange(RC.VALUES.ROLE_TYPE_CUSTOM)}
            style={getButtonStyle(selectedRoleType === RC.VALUES.ROLE_TYPE_CUSTOM)}
          >
            Custom
          </button>
        </Space>
        <FilterButton onClick={onFilterClick} />
      </div>
    </div>
  );
};

export default RoleTypeFilter;
