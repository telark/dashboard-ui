import React from 'react';
import { FancySpinner } from '../../../../components/animation';
import { HOME_DASHBOARD_LAYOUT as L, HOME_DASHBOARD_TEXTS as T } from '../../constants/dashboard';
import type { BoxState } from '../../models';
import BoxEmpty from '../display/BoxEmpty';

const BoxBody: React.FC<BoxState & { children: React.ReactNode }> = ({
  loading,
  failed,
  children,
}) => {
  if (loading) {
    return (
      <div
        style={{
          flex: 1,
          minHeight: L.BOX_BODY_MIN_HEIGHT_PX,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <FancySpinner size={L.SPINNER_SIZE_PX} />
      </div>
    );
  }
  if (failed) return <BoxEmpty>{T.LOAD_FAILED}</BoxEmpty>;
  return <>{children}</>;
};

export default BoxBody;
