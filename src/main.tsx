import '@ant-design/v5-patch-for-react-19';
import { StrictMode, startTransition } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import store from './store';
import App from './App';
import { FancySpinner } from './components/animation';
import { SHARED_DETAILS_CONSTANTS } from './constants';
import { clearOrphanedSyncing } from './features/resources/applications/store/slices/applicationsSlice';
import { listApplicationSyncInFlight } from './features/resources/applications/utils/management/syncInFlight';
import { forceSyncApplication } from './features/resources/applications/utils/management/sync';
import { fetchGlobalConfigThunk } from './features/globalconfig/store';
import { AppearanceProvider } from './features/settings/sections/appearance';
import './styles/index.css';
import './styles/antd.css';
import './styles/actionConfirmModal.css';

const persistor = persistStore(store);
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

startTransition(() => {
  root.render(
    <StrictMode>
      <Provider store={store}>
        <PersistGate
          loading={
            <FancySpinner label={SHARED_DETAILS_CONSTANTS.MESSAGES.LOADING} showLabel={true} />
          }
          persistor={persistor}
          onBeforeLift={() => {
            const live = listApplicationSyncInFlight();
            store.dispatch(clearOrphanedSyncing(live));

            const { syncStatus } = store.getState().applications;
            if (syncStatus) {
              const liveSet = new Set(live);
              for (const name of Object.keys(syncStatus)) {
                if (syncStatus[name] === 'syncing' && !liveSet.has(name)) {
                  forceSyncApplication(name);
                }
              }
            }

            store.dispatch(fetchGlobalConfigThunk());
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
