import React from 'react';
import { Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { ROLES_CONSTANTS as RC } from '../../../../roles/constants';
import { ATTACHED_ROLES_CONSTANTS as ARC } from '../../../constants';
import { DEFAULT_COLORS } from '../../../../../../constants';

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

  const handleFilterClick = () => {
    onFilterClick?.();
  };

  const getButtonStyle = (isActive: boolean) => ({
    ...ARC.FILTER.BUTTON.BASE,
    ...(isActive ? ARC.FILTER.BUTTON.ACTIVE : ARC.FILTER.BUTTON.INACTIVE),
  });

  const filterButtonStyle: React.CSSProperties = {
    all: 'unset',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    border: 'none',
    backgroundColor: 'transparent',
    color: '#64748b',
    fontFamily: "'Roboto Condensed', sans-serif",
    transition: 'all 0.2s',
  };

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
        <button
          type="button"
          onClick={handleFilterClick}
          style={filterButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = DEFAULT_COLORS.HOVER_BG;
            e.currentTarget.style.color = DEFAULT_COLORS.SUCCESS;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          <FilterOutlined style={{ fontSize: 14, lineHeight: 1 }} />
          <span>Filter</span>
        </button>
      </div>
    </div>
  );
};

export default RoleTypeFilter;
