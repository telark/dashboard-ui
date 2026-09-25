import React, { useCallback } from 'react';
import { Segmented } from 'antd';
import { useSearchParams } from 'react-router-dom';
import {
  PLANS_PAGE_TAB_PARAM,
  PROTECTION_PLANS_CONSTANTS as PPC,
} from '../../constants/protectionPlans';
import type { PlansPageTab } from '../../models';

const TAB_OPTIONS: { value: PlansPageTab; label: string }[] = [
  { value: 'plans', label: PPC.LABELS.TABS.PLANS },
  { value: 'reports', label: PPC.LABELS.TABS.REPORTS },
];

export const readPlansPageTab = (searchParams: URLSearchParams): PlansPageTab =>
  searchParams.get(PLANS_PAGE_TAB_PARAM) === 'reports' ? 'reports' : 'plans';

const ProtectionPlansTabs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const onChange = useCallback(
    (next: PlansPageTab) =>
      setSearchParams(next === 'plans' ? {} : { [PLANS_PAGE_TAB_PARAM]: next }),
    [setSearchParams],
  );
  return (
    <div>
      <Segmented<PlansPageTab>
        value={readPlansPageTab(searchParams)}
        onChange={onChange}
        options={TAB_OPTIONS}
      />
    </div>
  );
};

export default ProtectionPlansTabs;
