import React, { useState } from 'react';
import { Timeline, Drawer } from 'antd';
import { HistoryInterface, Record } from '../../interfaces/common'; // Adjust path as needed
import TimeAgo from '../Time/TimeAgo'; // Adjust path as needed
import { DEFAULT_COLORS } from '../../constants'; // Adjust path as needed
import PrimaryButtonWithOutLoading from '../Buttons/PrimayButtonWithOutLoading';
import { EyeOutlined } from '@ant-design/icons';

const getTimelineColor = (status: string): string => {
  if (status === 'Success') {
    return DEFAULT_COLORS.SUCCESS;
  } else if (status === 'Error') {
    return DEFAULT_COLORS.ERROR;
  }
  return DEFAULT_COLORS.DEFAULT;
};

const HistoryTimeLine: React.FC<HistoryInterface> = ({ Records }) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  // Sort records by creationTime in ascending order (oldest first)
  const sortedRecords = [...Records].sort(
    (a, b) => new Date(a.creationTime).getTime() - new Date(b.creationTime).getTime()
  );

  // Get last 5 records for the main timeline
  const last5Records = sortedRecords.slice(-5);

  // Get the previous records for the drawer
  const previousRecords = sortedRecords.slice(0, -5); // Exclude the last 5 items

  const handleShowDrawer = () => {
    setIsDrawerVisible(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerVisible(false);
  };

  return (
    <div
      style={{
        padding: '5px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ width: '100%', maxWidth: '800px', position: 'relative' }}>
        {/* Top Indicator with Dot Connected to Timeline */}
        {previousRecords.length > 0 && (
          <div style={{ position: 'relative', textAlign: 'center', marginBottom: '16px' }}>
            {/* Top Text */}
            <div style={{ color: 'gray', fontSize: '12px', marginBottom: '5px' }}>
              Previous records are available below
            </div>
            {/* Dot */}
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#d9d9d9',
                margin: '0 auto',
                position: 'relative',
                zIndex: 1,
              }}
            ></div>
            {/* Long Vertical Line */}
            <div
              style={{
                marginTop: '10px',
                position: 'absolute',
                top: '8px', // Just beneath the dot
                left: '50%',
                transform: 'translateX(-50%)',
                width: '2px',
                height: '36px', // Extend this to match spacing between dot and first timeline item
                backgroundColor: '#d9d9d9',
                zIndex: 0,
              }}
            ></div>
          </div>
        )}

        {/* Main Timeline */}
        <Timeline
          pending="Recording..."
          mode="left"
          style={{ width: '100%' }}
          items={last5Records.map((item: Record) => ({
            label: <TimeAgo date={item.creationTime} />,
            color: getTimelineColor(item.status),
            children: <strong>{item.name}</strong>,
          }))}
        />

        {/* Centered "View Previous Records" Button */}
        {previousRecords.length > 0 && (
          <div style={{ textAlign: 'center' }}>
            <PrimaryButtonWithOutLoading
              onClick={handleShowDrawer}
              action="View Previous Records"
              icon={<EyeOutlined />}
            />
          </div>
        )}

        {/* Drawer for full history */}
        <Drawer
          title="Full History"
          placement="right"
          onClose={handleCloseDrawer}
          open={isDrawerVisible}
          width={400}
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Timeline
              mode="left"
              style={{ width: '100%' }}
              items={sortedRecords.map((item: Record) => ({
                label: <TimeAgo date={item.creationTime} />,
                color: getTimelineColor(item.status),
                children: <strong>{item.name}</strong>,
              }))}
            />
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default HistoryTimeLine;
