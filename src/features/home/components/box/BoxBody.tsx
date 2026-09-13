import React from 'react';
import { FancySpinner } from '../../../../components/animation';
import {
  HOME_DASHBOARD_LAYOUT as L,
  HOME_DASHBOARD_STYLES as S,
  HOME_DASHBOARD_TEXTS as T,
} from '../../constants/dashboard';
import type { BoxState } from '../../models';

const BoxBody: React.FC<BoxState & { children: React.ReactNode }> = ({
  loading,
  failed,
  children,
}) => {
  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <FancySpinner size={L.SPINNER_SIZE_PX} />
      </div>
    );
  }
  if (failed) return <div style={S.MUTED_TEXT}>{T.LOAD_FAILED}</div>;
  return <>{children}</>;
};

export default BoxBody;
