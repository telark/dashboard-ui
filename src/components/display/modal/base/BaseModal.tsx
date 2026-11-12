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

// A modal rendered in place sits inside its trigger, such as a clickable table row.
const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

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
        // In antd's slot because only that slot names the dialog (aria-labelledby).
        title={
          title && (
            <div role="none" onClick={stopPropagation}>
              <ActionTitle title={title} />
            </div>
          )
        }
        footer={null}
        width={width}
        zIndex={FRAME.Z_INDEX}
        centered
        // No antd motion: antd.css animates the modal and mask from the frame they mount.
        transitionName=""
        maskTransitionName=""
        rootClassName={FRAME.ROOT_CLASS_NAME}
        destroyOnHidden
        closable={closable}
        keyboard={closable}
        // No blur: re-blurring the page each frame held the open animation to about 15 fps.
        mask={{ closable }}
        getContainer={getContainer}
        className={`${FRAME.CLASS_NAME} ${PANEL_SURFACE_CLASS}`}
        styles={{
          container: {
            padding: FRAME.PADDING,
            borderRadius: FRAME.BORDER_RADIUS,
            overflow: 'hidden',
          },
          header: { marginBottom: MODAL_CHROME.CONTENT.gap },
          body: { padding: SPACING.NONE },
          close: MODAL_CHROME.CLOSE,
          wrapper: offsetRight ? { paddingRight: offsetRight } : undefined,
        }}
      >
        <div role="none" onClick={stopPropagation} style={MODAL_CHROME.CONTENT}>
          {description && <div style={MODAL_CHROME.MESSAGE}>{description}</div>}
          {children}
          {footer && <div style={PANEL_FOOTER.DIALOG}>{footer}</div>}
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default BaseModal;
