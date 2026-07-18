import React, { memo } from 'react';
import OIDCSection from './OIDCSection';
import SettingsNoPermissionsCard from '../../components/SettingsNoPermissionsCard';
import { IDENTITY_PROVIDER_CONSTANTS as C } from './constants';
import { usePermission } from '../../../auth/hooks/permissions/permissionEngine';

const IdentityProviderSectionContent: React.FC = memo(() => {
  const canView = usePermission('settings', 'Admin', 'editoidcconfig');
  if (!canView) {
    return <SettingsNoPermissionsCard description={C.LABELS.NO_VIEW_PERMISSION} />;
  }
  return <OIDCSection />;
});

IdentityProviderSectionContent.displayName = 'IdentityProviderSectionContent';

export default IdentityProviderSectionContent;
