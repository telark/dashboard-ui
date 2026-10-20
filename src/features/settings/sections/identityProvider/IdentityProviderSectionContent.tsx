import React, { memo } from 'react';
import { SETTINGS_CONSTANTS } from '../../constants';
import OIDCSection from './OIDCSection';
import SelfRegistrationSection from './SelfRegistrationSection';
import BootstrapAccountSection from './BootstrapAccountSection';

const { CONTENT } = SETTINGS_CONSTANTS;

const IdentityProviderSectionContent: React.FC = memo(() => (
  <>
    <OIDCSection />
    <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
      <SelfRegistrationSection />
    </div>
    <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
      <BootstrapAccountSection />
    </div>
  </>
));

IdentityProviderSectionContent.displayName = 'IdentityProviderSectionContent';

export default IdentityProviderSectionContent;
