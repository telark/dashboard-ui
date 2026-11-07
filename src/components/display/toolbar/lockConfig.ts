import type { ToolbarConfig } from '../../../interfaces/layout/toolbar';

export const lockConfig = <T extends ToolbarConfig | undefined>(
  config: T,
  reason: string | undefined,
): T =>
  config && reason
    ? { ...config, buttons: config.buttons.map((b) => ({ ...b, disabled: true, tooltip: reason })) }
    : config;
