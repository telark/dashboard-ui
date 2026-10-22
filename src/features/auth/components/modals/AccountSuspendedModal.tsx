import React, { useState } from 'react';
import { App as AntdApp } from 'antd';
import { useNavigate } from 'react-router-dom';
import { handleUserLogout } from '../../utils/logout/logout';
import { AUTH_CONSTANTS } from '../../constants/messages';
import { BaseModal } from '../../../../components/display/modal';
import { ActionButtons } from '../../../../components/display/buttons';

interface AccountSuspendedModalProps {
  open: boolean;
  onClose: () => void;
}

const { TITLE, MESSAGE, BUTTON_TEXT } = AUTH_CONSTANTS.SESSION.SUSPENDED.MODAL;

// Signs out through auth's logout: the exporter refuses a suspended account's own session delete.
const AccountSuspendedModal: React.FC<AccountSuspendedModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    const signedOut = await handleUserLogout(navigate, message);
    setLoading(false);
    if (signedOut) onClose();
  };

  return (
    <BaseModal
      open={open}
      onCancel={handleSignOut}
      closable={false}
      title={TITLE}
      description={MESSAGE}
      footer={
        <ActionButtons confirmText={BUTTON_TEXT} onConfirm={handleSignOut} loading={loading} />
      }
    />
  );
};

export default AccountSuspendedModal;
