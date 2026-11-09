import type { PropsWithChildren, ReactElement } from 'react';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event';
import { App as AntdApp, ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { permissionsSeed, resetStore, store, type StoreSeed } from './store';

interface AppRenderOptions {
  /** Initial URL. */
  route?: string;
  /** Route pattern, for components that read useParams. */
  path?: string;
  /** Slice overrides. Defaults to an Owner on every scope. */
  seed?: StoreSeed;
}

// antd's CSS transitions never end in jsdom, so a closing modal would stay mounted.
const TEST_THEME = { token: { motion: false } };
const LOCATION_TEST_ID = 'test-location';

const LocationProbe = () => {
  const { pathname, search } = useLocation();
  return <span data-testid={LOCATION_TEST_ID} hidden>{`${pathname}${search}`}</span>;
};

const createWrapper = ({ route = '/', path }: AppRenderOptions) =>
  function AppWrapper({ children }: PropsWithChildren) {
    return (
      <Provider store={store}>
        <ConfigProvider theme={TEST_THEME}>
          <AntdApp>
            <MemoryRouter initialEntries={[route]}>
              {path ? (
                <Routes>
                  <Route path={path} element={children} />
                </Routes>
              ) : (
                children
              )}
              <LocationProbe />
            </MemoryRouter>
          </AntdApp>
        </ConfigProvider>
      </Provider>
    );
  };

const prepare = (options: AppRenderOptions) => {
  resetStore(options.seed ?? permissionsSeed());
  return {
    wrapper: createWrapper(options),
    // antd's pointer-events styles are all computed per click, which is slow and tells a test nothing.
    user: userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never }),
  };
};

/** Renders under the app's real providers: the store singleton, a router and antd's App. */
export const renderApp = (ui: ReactElement, options: AppRenderOptions = {}) => {
  const { wrapper, user } = prepare(options);
  return { ...render(ui, { wrapper }), user, store };
};

/** renderApp for a hook. */
export const renderAppHook = <TResult, TProps>(
  hook: (props: TProps) => TResult,
  options: AppRenderOptions & { initialProps?: TProps } = {},
) => {
  const { wrapper, user } = prepare(options);
  return { ...renderHook(hook, { wrapper, initialProps: options.initialProps }), user, store };
};

/** The URL the app navigated to, so tests assert navigation without mocking the router. */
export const currentLocation = (): string | null =>
  screen.getByTestId(LOCATION_TEST_ID).textContent;
