import React, { memo } from 'react';
import OIDCSection from './OIDCSection';
import { NoPermissionCard } from '../../../../components/shared';
import { IDENTITY_PROVIDER_CONSTANTS as C } from './constants';
import {
  ACTION_PERMISSIONS,
  usePermission,
} from '../../../auth/hooks/permissions/permissionEngine';

const { scope, level } = ACTION_PERMISSIONS.settings.editOidcConfig;

const IdentityProviderSectionContent: React.FC = memo(() => {
  const canView = usePermission(scope, level);
  if (!canView) {
    return <NoPermissionCard featureName={C.LABELS.CARD_TITLE} permission={{ scope, level }} />;
  }
  return <OIDCSection />;
});

IdentityProviderSectionContent.displayName = 'IdentityProviderSectionContent';

export default IdentityProviderSectionContent;
