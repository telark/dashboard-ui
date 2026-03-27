import React from 'react';
import LoadingView from '../../../components/display/views/LoadingView';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';

const ProtectionPlansLoadingPage: React.FC = () => {
  return <LoadingView label={PPC.LABELS.HEADER_SUBTITLE} />;
};

export default ProtectionPlansLoadingPage;
