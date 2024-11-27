import React from 'react';
import { Timeline } from 'antd';
import { HistoryInterface, Record } from '../../interfaces/common'; // Adjust path as needed
import TimeAgo from '../Time/TimeAgo'; // Adjust path as needed
import { DEFAULT_COLORS } from '../../config'; // Adjust path as needed


const getTimelineColor = (status: string): string => {
  if (status === "Success") {
    return DEFAULT_COLORS.SUCCESS;
  } else if (status === "Error") {
    return DEFAULT_COLORS.ERROR;
  }
  return DEFAULT_COLORS.DEFAULT;
};

const HistoryTimeLine: React.FC<HistoryInterface> = ({ Records }) => {
  return (
    <div
    style={{
        padding: "5px",
        display: "flex", // Use flexbox for centering
        justifyContent: "center", // Center horizontally
        alignItems: "flex-start", // Align timeline at the top to leave space for its content
        minHeight: "6OOpx", // Ensure there's enough space for vertical centering
        }}
    >
    <Timeline
    pending="Recording..."
    mode="left"
    style={{
        width: "100%", // Ensure full width up to the container
        maxWidth: "800px", // Adjust max width if needed (ensure it doesn't stretch too much)
    }}
    items={Records.map((item: Record, index: number) => ({
        label: <TimeAgo date={item.creationTime} />,
        color: getTimelineColor(item.status),
        children: <strong>{item.event}</strong>,
    }))}
    />
    </div>
  );
};

export default HistoryTimeLine;

