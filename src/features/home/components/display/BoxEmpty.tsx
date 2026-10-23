import React from 'react';
import { Empty, Typography } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { DEFAULT_COLORS, EMPTY_CLASS } from '../../../../constants';
import { HOME_DASHBOARD_LAYOUT as L } from '../../constants/dashboard';

// Good news only, in the snapshot compare view's "No differences" style.
export const SuccessCheck: React.FC = () => (
  <CheckCircleFilled style={{ color: DEFAULT_COLORS.SUCCESS }} />
);

interface BoxEmptyProps {
  // The box's own icon (muted) or SuccessCheck; unset, the text stands alone.
  icon?: React.ComponentType;
  children: React.ReactNode;
}

// Fills the box body, so the message sits at its center. The box pads it, and its row sets the height.
const BoxEmpty: React.FC<BoxEmptyProps> = ({ icon: Icon, children }) => (
  <Empty
    className={EMPTY_CLASS.SECTION}
    style={{ flex: 1, minHeight: 0, padding: 0 }}
    styles={{ image: { fontSize: L.EMPTY_ICON_SIZE_PX } }}
    image={Icon ? <Icon /> : false}
    description={<Typography.Text>{children}</Typography.Text>}
  />
);

export default BoxEmpty;
