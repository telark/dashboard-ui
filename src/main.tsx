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
import { initPerformanceMonitoring, initNavigationOptimizations } from './utils/performance';
import './styles/index.css';
import './styles/antd.css';

initPerformanceMonitoring();
initNavigationOptimizations();

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
        >
          <App />
        </PersistGate>
      </Provider>
    </StrictMode>,
  );
});
