import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// No need to import index.css as we're using our global.scss
import * as serviceWorker from './serviceWorker';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin, withAITracking } from '@microsoft/applicationinsights-react-js';

const reactPlugin = new ReactPlugin();
const appInsights = new ApplicationInsights({
  config: {
    connectionString: import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING,
    extensions: [reactPlugin],
    extensionConfig: {
      [reactPlugin.identifier]: { history: (window as any).history }
    }
  }
});
appInsights.loadAppInsights();
appInsights.trackPageView(); // Manually track first page view



// Wrap your App component with withAITracking to enable automatic tracking
const AppWithAITracking = withAITracking(reactPlugin, App);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWithAITracking />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
