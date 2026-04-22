import React, { memo, useMemo } from 'react';
import { PASSKEYS_CONSTANTS as PPC } from '../../constants/passkeys';
import EmptyState from '../../../../components/display/views/EmptyState';
import { Icons } from '../../../../constants';

const PasskeyIcon = Icons.Passkey;

interface PasskeysEmptyPageProps {
  onCreatePasskeyClick: () => void;
}

const PasskeysEmptyPage: React.FC<PasskeysEmptyPageProps> = memo(({ onCreatePasskeyClick }) => {
  const buttonIcon = useMemo(() => <PasskeyIcon size={16} />, []);
  const icon = useMemo(() => <PasskeyIcon size={32} />, []);

  return (
    <EmptyState
      title={PPC.LABELS.EMPTY.TITLE}
      description={PPC.LABELS.EMPTY.DESCRIPTION}
      icon={icon}
      primaryAction={{
        label: PPC.LABELS.EMPTY.BUTTON,
        icon: buttonIcon,
        onClick: onCreatePasskeyClick,
      }}
    />
  );
});

PasskeysEmptyPage.displayName = 'PasskeysEmptyPage';

export default PasskeysEmptyPage;
