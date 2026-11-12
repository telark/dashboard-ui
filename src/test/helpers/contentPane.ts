import { APP_CONFIGS } from '../../constants';

/** Mounts the app's scrolling content pane, which the layout hooks look up by id. */
export const mountContentPane = (): HTMLElement => {
  const pane = document.createElement('div');
  pane.id = APP_CONFIGS.LAYOUT.CONTENT_ID;
  document.body.append(pane);
  return pane;
};
