import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import store from './store';
import App from './App';
import { FancySpinner } from './components/shared';
import './styles/index.css';
import './styles/antd.css';

const persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <PersistGate
      loading={<FancySpinner label="Loading..." showLabel={true} />}
      persistor={persistor}
    >
      <App />
    </PersistGate>
  </Provider>,
);
