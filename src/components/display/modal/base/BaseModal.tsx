import React from 'react';
import { ConfigProvider, Modal, theme } from 'antd';
import type { BaseModalProps } from '../../../../interfaces/layout/modal';
import { useOpenedOnce } from '../../../../hooks/layout/useOpenedOnce';
import {
  CONTROL_HEIGHT,
  MODAL_CHROME,
  PANEL_SURFACE_CLASS,
  PANEL_THEME_TOKENS,
  SELECT_THEME,
} from '../../../../constants';
import { ActionTitle } from '../../text';

const { FRAME } = MODAL_CHROME;

const BaseModal: React.FC<BaseModalProps> = ({
  open,
  onCancel,
  title,
  description,
  width = FRAME.WIDTH,
  closable = true,
  getContainer,
  offsetRight,
  footer,
  children,
}) => {
  const opened = useOpenedOnce(open);

  if (!opened) return null;
  // A modal would take the theme of whatever declares it (dark page, panel, auth page),
  // so it sets the light surface itself, like the panels do.
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: { ...PANEL_THEME_TOKENS, controlHeight: CONTROL_HEIGHT },
        components: { Select: SELECT_THEME },
      }}
    >
      <Modal
        open={open}
        onCancel={onCancel}
        title={null}
        footer={null}
        width={width}
        zIndex={FRAME.Z_INDEX}
        centered
        destroyOnHidden
        closable={closable}
        keyboard={closable}
        mask={{ blur: true, closable }}
        getContainer={getContainer}
        className={`${FRAME.CLASS_NAME} ${PANEL_SURFACE_CLASS}`}
        styles={{
          container: { padding: 0, borderRadius: FRAME.BORDER_RADIUS, overflow: 'hidden' },
          body: { padding: FRAME.PADDING },
          close: MODAL_CHROME.CLOSE,
          wrapper: offsetRight ? { paddingRight: offsetRight } : undefined,
        }}
      >
        {/* A modal rendered in place sits inside its trigger, such as a clickable table row. */}
        <div onClick={(e) => e.stopPropagation()} style={MODAL_CHROME.CONTENT}>
          {title && <ActionTitle title={title} />}
          {description && <div style={MODAL_CHROME.MESSAGE}>{description}</div>}
          {children}
          {footer}
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default BaseModal;
