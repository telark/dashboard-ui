import { AiOutlineSafety, AiOutlineCheckCircle, AiOutlineTag, AiOutlineClockCircle, AiOutlineLock } from 'react-icons/ai';
import type { Role } from '../interfaces/roles';
import type { ViewDetailsConfig } from '../components/display/shared/ViewDetails';
import { Space } from 'antd';
import { StatusTag } from '../components/tags';
import { DEFAULT_COLORS } from '../constants';

export const createRoleViewConfig = (role: Role): ViewDetailsConfig => {
  return {
    fields: [
      {
        key: 'name',
        label: 'Name',
        value: role.name,
        icon: <AiOutlineSafety />,
        type: 'text',
      },
      {
        key: 'status',
        label: 'Status',
        value: (
          <StatusTag
            label={role.status}
            icon={<AiOutlineCheckCircle />}
            color={role.status === 'Active' ? DEFAULT_COLORS.SUCCESS : '#6b7280'}
          />
        ),
        icon: <AiOutlineCheckCircle />,
        type: 'custom',
      },
      {
        key: 'type',
        label: 'Type',
        value: (
          <StatusTag
            label={role.type}
            icon={<AiOutlineTag />}
            color={role.type === 'built-in' ? '#9333ea' : '#3b82f6'}
          />
        ),
        icon: <AiOutlineTag />,
        type: 'custom',
      },
      {
        key: 'createdAt',
        label: 'Created At',
        value: new Date(role.createdAt).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        icon: <AiOutlineClockCircle />,
        type: 'text',
      },
      {
        key: 'scopes',
        label: 'Scopes & Permissions',
        value: (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
            {Object.entries(role.scopes).map(([area, permissions]) => (
              <div key={area} style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 120 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#111827',
                    textTransform: 'capitalize',
                  }}
                >
                  {area}
                </div>
                <Space wrap>
                  {permissions.map((permission) => (
                    <StatusTag
                      key={permission}
                      label={permission}
                      color="#3b82f6"
                      borderColor="#3b82f6"
                    />
                  ))}
                </Space>
              </div>
            ))}
          </div>
        ),
        icon: <AiOutlineLock />,
        type: 'composed',
      },
    ],
  };
};

