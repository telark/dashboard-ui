import React, { useState } from 'react';
import { Drawer, Tabs } from 'antd';
import HealthSection from './HealthSection';
import ViolationsSection from './ViolationsSection';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import type { ProtectionPlan } from '../../models';

interface PlanDetailsDrawerProps {
  plan: ProtectionPlan | null;
  open: boolean;
  onClose: () => void;
  onPlanRefresh?: () => void;
}

type TabKey = 'health' | 'violations';

const PlanDetailsDrawer: React.FC<PlanDetailsDrawerProps> = ({
  plan,
  open,
  onClose,
  onPlanRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('health');

  if (!plan) {
    return <Drawer open={open} onClose={onClose} title="" width={720} destroyOnClose />;
  }

  return (
    <Drawer open={open} onClose={onClose} title={plan.name} width={720} destroyOnClose>
      <Tabs
        activeKey={activeTab}
        onChange={(k) => setActiveTab(k as TabKey)}
        items={[
          {
            key: 'health',
            label: PPC.LABELS.HEALTH_DETAIL.TITLE,
            children: <HealthSection plan={plan} onPlanRefresh={onPlanRefresh} />,
          },
          {
            key: 'violations',
            label: PPC.LABELS.VIOLATIONS.TAB_LABEL,
            children: <ViolationsSection planId={plan.id} />,
          },
        ]}
      />
    </Drawer>
  );
};

export default PlanDetailsDrawer;
