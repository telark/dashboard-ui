import React, { memo } from 'react';
import { SETTINGS_CONSTANTS } from '../../constants';
import OIDCSection from './OIDCSection';
import SelfRegistrationSection from './SelfRegistrationSection';
import BootstrapAccountSection from './BootstrapAccountSection';

const { CONTENT } = SETTINGS_CONSTANTS;

// A flex gap, not margins: the bootstrap card can render nothing and must leave no gap behind.
const IdentityProviderSectionContent: React.FC = memo(() => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: CONTENT.GAP_BETWEEN_CARDS }}>
    <OIDCSection />
    <SelfRegistrationSection />
    <BootstrapAccountSection />
  </div>
));

IdentityProviderSectionContent.displayName = 'IdentityProviderSectionContent';

export default IdentityProviderSectionContent;
