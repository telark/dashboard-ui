import React from 'react';
import { ConfigProvider, Modal } from 'antd';
import type { BaseModalProps } from '../../../../interfaces/layout/modal';
import { useOpenedOnce } from '../../../../hooks/layout/useOpenedOnce';
import {
  MODAL_CHROME,
  OVERLAY_THEME,
  PANEL_FOOTER,
  PANEL_SURFACE_CLASS,
  SPACING,
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
    <ConfigProvider theme={OVERLAY_THEME}>
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
          container: {
            padding: SPACING.NONE,
            borderRadius: FRAME.BORDER_RADIUS,
            overflow: 'hidden',
          },
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
          {footer && <div style={PANEL_FOOTER.DIALOG}>{footer}</div>}
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default BaseModal;
