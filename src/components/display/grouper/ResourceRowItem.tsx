import React from 'react';
import { AppstoreOutlined, SyncOutlined } from '@ant-design/icons';
import { AiOutlineApi } from 'react-icons/ai';
import { Checkbox } from 'antd';
import { DEFAULT_COLORS } from '../../../constants';
import TimeAgo from '../../time/TimeAgo';
import { ParseGoTimeDate } from '../../../utils/shared/time';
import ResourceTag from './ResourceTag';
import { ResourceRowItemProps } from '../../../interfaces/grouper';

const ResourceRowItem: React.FC<ResourceRowItemProps> = React.memo(
  ({ resource, isSelected, onSelect }) => {
    const isBridge = resource.type === 'bridge';
    const sourceType = resource.sourceType || resource.type || '';
    const displayName = resource.sourceName || resource.name;

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '4px 16px',
          border: '1px solid #eef2f6',
          borderRadius: 12,
          background: '#fff',
          transition: 'all 0.2s',
          gap: 16,
        }}
      >
        <Checkbox checked={isSelected} onChange={(e) => onSelect(e.target.checked)} />

        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(32,201,151,0.12)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: DEFAULT_COLORS.SUCCESS,
            flexShrink: 0,
          }}
        >
          {isBridge ? (
            <AiOutlineApi style={{ fontSize: 16 }} />
          ) : (
            <AppstoreOutlined style={{ fontSize: 16 }} />
          )}
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              minWidth: 200,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: '#0B1F33',
                fontSize: 14,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {displayName}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#5B6B7C',
                fontSize: 12,
              }}
            >
              <SyncOutlined />
              <TimeAgo date={ParseGoTimeDate(resource.lastSync)} />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexShrink: 0,
            }}
          >
            <ResourceTag type="type" value={sourceType} />
            <ResourceTag type="status" value={resource.status} />
          </div>
        </div>
      </div>
    );
  },
);

ResourceRowItem.displayName = 'ResourceRowItem';
export default ResourceRowItem;

