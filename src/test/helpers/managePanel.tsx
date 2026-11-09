import type { ComponentType } from 'react';
import { vi } from 'vitest';
import { renderApp } from '../render';
import { permissionsSeed, type StoreSeed } from '../store';

interface ManagePanelProps {
  open: boolean;
  onClose: () => void;
  applicationName: string;
}

/** Renders one of an application's slide-out panels, open. `props` are the panel's own. */
export const renderManagePanel = <TProps extends ManagePanelProps>(
  Panel: ComponentType<TProps>,
  applicationName: string,
  props: Omit<TProps, keyof ManagePanelProps>,
  seed: StoreSeed = permissionsSeed(),
) => {
  const panelProps = {
    ...props,
    open: true,
    onClose: vi.fn(),
    applicationName,
  } as unknown as TProps;
  return renderApp(<Panel {...panelProps} />, { seed });
};
