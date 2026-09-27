import { StrictMode, startTransition } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';
import App from './App';
import FullPageLoader from './components/display/views/FullPageLoader';
import { AppearanceProvider } from './features/settings/sections/appearance';
import { dropForeignPermissions } from './features/auth/hooks';
import { registerHealthInterceptors, selectServiceHealth } from './api';
import { applyColorVariables } from './constants';
import './styles/index.css';
import './styles/antd.css';
import './styles/actionConfirmModal.css';

applyColorVariables();

registerHealthInterceptors({
  getServiceHealth: (name) => selectServiceHealth(store.getState(), name),
  dispatch: (action) => store.dispatch(action),
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

startTransition(() => {
  root.render(
    <StrictMode>
      <Provider store={store}>
        <PersistGate
          // No label: this and the route-level Suspense fallback are the same
          // two-stage boot sequence, and must render pixel-identical or the
          // switch between them reads as two different spinners flashing.
          loading={<FullPageLoader minHeight="100vh" />}
          persistor={persistor}
          onBeforeLift={dropForeignPermissions}
        >
          <AppearanceProvider>
            <App />
          </AppearanceProvider>
        </PersistGate>
      </Provider>
    </StrictMode>,
  );
});
