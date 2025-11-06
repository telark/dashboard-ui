import React from 'react';
import { Drawer, Button, Spin } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { TimelineView } from './TimelineView';
import FancySpinner from '../../../shared/FancySpinner';
import { UI } from '../../../../constants';
import type { TimelineDrawerProps } from '../../../../interfaces/timeline';
import { TIMELINE_CONSTANTS, TIMELINE_STYLES } from '../../../../constants';

export const TimelineDrawer: React.FC<TimelineDrawerProps> = React.memo(
  ({ open, onClose, visibleItems, isLoading, hasMoreItems, totalItems, onLoadMore }) => {
    return (
      <Drawer
        title={
          <div
            style={{
              ...TIMELINE_STYLES.DRAWER.title,
              paddingLeft: TIMELINE_CONSTANTS.PADDING_LEFT - TIMELINE_CONSTANTS.HEADER_LEFT_PADDING,
            }}
          >
            <span style={TIMELINE_STYLES.DRAWER.titleText}>{UI.HISTORY.FULL_TITLE}</span>
            <span onClick={onClose} style={TIMELINE_STYLES.DRAWER.closeButton} aria-label="Close">
              <CloseOutlined />
            </span>
          </div>
        }
        closable={false}
        placement="right"
        width={TIMELINE_CONSTANTS.DRAWER_WIDTH}
        open={open}
        onClose={onClose}
        styles={{
          body: TIMELINE_STYLES.DRAWER.body,
          header: TIMELINE_STYLES.DRAWER.header,
        }}
      >
        {isLoading && visibleItems.length === 0 ? (
          <div style={TIMELINE_STYLES.DRAWER.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <TimelineView items={visibleItems} />
            {hasMoreItems && (
              <div style={TIMELINE_STYLES.DRAWER.loadMoreContainer}>
                {isLoading ? (
                  <FancySpinner showLabel={false} />
                ) : (
                  <Button onClick={onLoadMore} style={TIMELINE_STYLES.DRAWER.loadMoreButton}>
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
