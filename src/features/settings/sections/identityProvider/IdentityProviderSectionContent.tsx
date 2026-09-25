import React, { memo } from 'react';
import OIDCSection from './OIDCSection';
import SettingsNoPermissionsCard from '../../components/SettingsNoPermissionsCard';
import { IDENTITY_PROVIDER_CONSTANTS as C } from './constants';
import {
  ACTION_PERMISSIONS,
  usePermission,
} from '../../../auth/hooks/permissions/permissionEngine';

const { scope, level } = ACTION_PERMISSIONS.settings.editOidcConfig;

const IdentityProviderSectionContent: React.FC = memo(() => {
  const canView = usePermission(scope, level);
  if (!canView) {
    return <SettingsNoPermissionsCard description={C.LABELS.NO_VIEW_PERMISSION} />;
  }
  return <OIDCSection />;
});

IdentityProviderSectionContent.displayName = 'IdentityProviderSectionContent';

export default IdentityProviderSectionContent;
