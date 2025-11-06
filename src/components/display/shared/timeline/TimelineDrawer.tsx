import React from 'react';
import { Drawer, Button, Spin } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import type { Record } from '../../../../interfaces/shared';
import { TimelineView } from './TimelineView';
import FancySpinner from '../../../shared/FancySpinner';
import { DEFAULT_COLORS, UI } from '../../../../constants';

interface TimelineDrawerProps {
  open: boolean;
  onClose: () => void;
  visibleItems: Record[];
  isLoading: boolean;
  hasMoreItems: boolean;
  totalItems: number;
  onLoadMore: () => void;
}

const PADDING_LEFT = 42;
const HEADER_LEFT_PADDING = 16; // antd Drawer default left padding

export const TimelineDrawer: React.FC<TimelineDrawerProps> = React.memo(
  ({ open, onClose, visibleItems, isLoading, hasMoreItems, totalItems, onLoadMore }) => {
    return (
      <Drawer
        title={
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: PADDING_LEFT - HEADER_LEFT_PADDING,
            }}
          >
            <span style={{ fontWeight: 700, color: '#0B1F33' }}>{UI.HISTORY.FULL_TITLE}</span>
            <span
              onClick={onClose}
              style={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#6b7280',
                display: 'inline-flex',
              }}
              aria-label="Close"
            >
              <CloseOutlined />
            </span>
          </div>
        }
        closable={false}
        placement="right"
        width={420}
        open={open}
        onClose={onClose}
        styles={{ body: { padding: 16 }, header: { borderBottom: 'none', padding: '12px 16px' } }}
      >
        {isLoading && visibleItems.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <TimelineView items={visibleItems} />
            {hasMoreItems && (
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                {isLoading ? (
                  <FancySpinner showLabel={false} />
                ) : (
                  <Button
                    onClick={onLoadMore}
                    style={{
                      borderColor: DEFAULT_COLORS.SUCCESS,
                      color: DEFAULT_COLORS.SUCCESS,
                      borderWidth: 1,
                      borderRadius: 12,
                      height: 36,
                    }}
                  >
                    Load More ({totalItems - visibleItems.length} remaining)
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </Drawer>
    );
  },
);

TimelineDrawer.displayName = 'TimelineDrawer';
