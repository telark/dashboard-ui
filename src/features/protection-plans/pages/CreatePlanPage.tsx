import React, { useCallback, useMemo } from 'react';
import { Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';
import {
  CreatePlanLayout,
  BasicInfoSection,
  ScopeSection,
  ScheduleSection,
  PoliciesSection,
} from '../components/create';

const CreatePlanPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const breadcrumbItems = useMemo(
    () => [
      { label: PPC.LABELS.BREADCRUMBS.ROOT, onClick: () => navigate(APP_ROUTES.PROTECTION_PLANS) },
      { label: PPC.LABELS.BREADCRUMBS.CREATE },
    ],
    [navigate],
  );

  const handleFinish = useCallback(() => {
    // TODO: submit form values and navigate back or to list
    navigate(APP_ROUTES.PROTECTION_PLANS);
  }, [navigate]);

  return (
    <CreatePlanLayout
      breadcrumbItems={breadcrumbItems}
      subtitle={PPC.LABELS.CREATE_SUBTITLE}
      submitLabel={PPC.LABELS.CREATE_BUTTON_TEXT}
      onSubmit={handleFinish}
      form={form}
    >
      <BasicInfoSection />
      <ScopeSection />
      <ScheduleSection />
      <PoliciesSection />
    </CreatePlanLayout>
  );
};

export default CreatePlanPage;
