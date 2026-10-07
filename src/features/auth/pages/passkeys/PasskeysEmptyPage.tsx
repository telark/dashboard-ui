import React, { memo } from 'react';
import { Button, Empty, Typography } from 'antd';
import { PASSKEYS_CONSTANTS as PPC } from '../../constants/passkeys';
import { EMPTY_ACTION_STYLE, EMPTY_CLASS, Icons } from '../../../../constants';
import { InsecureContextAlert } from '../../components';
import { isWebAuthnSupported } from '../../utils/webauthn/core';

const PasskeyIcon = Icons.Passkey;

interface PasskeysEmptyPageProps {
  onCreatePasskeyClick: () => void;
}

const PasskeysEmptyPage: React.FC<PasskeysEmptyPageProps> = memo(({ onCreatePasskeyClick }) => {
  const passkeysAvailable = isWebAuthnSupported();

  return (
    <>
      {!passkeysAvailable && <InsecureContextAlert />}
      <Empty
        className={EMPTY_CLASS.PAGE}
        image={<PasskeyIcon size={32} />}
        description={
          <>
            <Typography.Title level={3}>{PPC.LABELS.EMPTY.TITLE}</Typography.Title>
            <Typography.Text>{PPC.LABELS.EMPTY.DESCRIPTION}</Typography.Text>
          </>
        }
      >
        <Button
          type="primary"
          icon={<PasskeyIcon size={16} />}
          onClick={onCreatePasskeyClick}
          disabled={!passkeysAvailable}
          style={EMPTY_ACTION_STYLE}
        >
          {PPC.LABELS.EMPTY.BUTTON}
        </Button>
      </Empty>
    </>
  );
});

PasskeysEmptyPage.displayName = 'PasskeysEmptyPage';

export default PasskeysEmptyPage;
