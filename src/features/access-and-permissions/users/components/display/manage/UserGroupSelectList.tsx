import React from 'react';
import { Form, Radio } from 'antd';
import { DEFAULT_COLORS } from '../../../../../../constants';
import { USERS_CONSTANTS as UC } from '../../../constants';
import { CapitalizeFirstLetter } from '../../../../../../utils/helpers/format';
import type { Group } from '../../../../groups/models';

interface UserGroupSelectListProps {
  groups?: Group[];
  loading: boolean;
}

const listContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  maxHeight: 'calc(100vh - 320px)',
  overflowY: 'auto',
  width: '100%',
  boxSizing: 'border-box',
};

const itemBaseStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  padding: '5px 14px',
  background: DEFAULT_COLORS.BACKGROUND_LIGHT,
  border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
  borderRadius: 8,
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  minHeight: 48,
  width: '100%',
  boxSizing: 'border-box',
};

const emptyStateStyle: React.CSSProperties = {
  padding: 24,
  textAlign: 'center',
  color: DEFAULT_COLORS.TEXT_MUTED,
};

const UserGroupSelectList: React.FC<UserGroupSelectListProps> = ({ groups, loading }) => {
  if (loading) {
    return <div style={emptyStateStyle}>{UC.LABELS.MESSAGES.LOADING_GROUPS}</div>;
  }

  if (!groups || groups.length === 0) {
    return <div style={emptyStateStyle}>{UC.LABELS.MESSAGES.NO_GROUPS_AVAILABLE}</div>;
  }

  return (
    <Form.Item name="groupID" style={{ margin: 0, width: '100%' }}>
      <Radio.Group style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={listContainerStyle}>
          {groups.map((group) => (
            <div
              key={group.id}
              style={itemBaseStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = DEFAULT_COLORS.BACKGROUND_HOVER;
                e.currentTarget.style.borderColor = DEFAULT_COLORS.BORDER_HOVER;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = DEFAULT_COLORS.BACKGROUND_LIGHT;
                e.currentTarget.style.borderColor = DEFAULT_COLORS.BORDER_LIGHT;
              }}
            >
              <Radio value={group.id} style={{ margin: 0, width: '100%' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      color: DEFAULT_COLORS.TEXT_PRIMARY,
                      fontWeight: 500,
                      lineHeight: 1.4,
                    }}
                  >
                    {CapitalizeFirstLetter(group.name)}
                  </div>
                  {group.description && (
                    <div
                      style={{
                        fontSize: 12,
                        color: DEFAULT_COLORS.TEXT_MUTED,
                        marginTop: 2,
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {CapitalizeFirstLetter(group.description)}
                    </div>
                  )}
                </div>
              </Radio>
            </div>
          ))}
        </div>
      </Radio.Group>
    </Form.Item>
  );
};

export default UserGroupSelectList;
