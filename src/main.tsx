import { StrictMode, startTransition } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';
import App from './App';
import { dropForeignPermissions } from './features/auth/hooks';
import { dropLegacySessionToken } from './features/auth/utils';
import { registerHealthInterceptors, selectServiceHealth } from './api';
import { applyColorVariables, applyLayoutVariables } from './constants';
import './styles/index.css';
import './styles/antd.css';

applyColorVariables();
applyLayoutVariables();
dropLegacySessionToken();

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
          // Nothing while the store rehydrates: a spinner here sits at the viewport center,
          // then jumps to the content pane's when the shell mounts.
          loading={null}
          persistor={persistor}
          onBeforeLift={dropForeignPermissions}
        >
          <App />
        </PersistGate>
      </Provider>
    </StrictMode>,
  );
});
