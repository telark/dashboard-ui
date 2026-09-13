import { StrictMode, startTransition } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import store from './store';
import App from './App';
import FullPageLoader from './components/display/views/FullPageLoader';
import { clearOrphanedSyncing } from './features/resources/applications/store/slices/applicationsSlice';
import { listApplicationSyncInFlight } from './features/resources/applications/utils/management/syncInFlight';
import { AppearanceProvider } from './features/settings/sections/appearance';
import { registerHealthInterceptors, selectServiceHealth } from './api';
import './styles/index.css';
import './styles/antd.css';
import './styles/actionConfirmModal.css';

registerHealthInterceptors({
  getServiceHealth: (name) => selectServiceHealth(store.getState(), name),
  dispatch: (action) => store.dispatch(action),
});

const persistor = persistStore(store);
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
          onBeforeLift={() => {
            store.dispatch(clearOrphanedSyncing(listApplicationSyncInFlight()));
          }}
        >
          <AppearanceProvider>
            <App />
          </AppearanceProvider>
        </PersistGate>
      </Provider>
    </StrictMode>,
  );
});
