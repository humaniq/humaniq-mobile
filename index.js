/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import './shim.js'
import * as Sentry from "@sentry/react-native";

export const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
    environment: "",
    dsn: "https://f36147161d1d4bc79211d02daebb4134@o1114073.ingest.sentry.io/6145030",
    tracesSampleRate: 1.0,
    integrations: [
        new Sentry.ReactNativeTracing({
            routingInstrumentation,
        }),
    ],
});

Sentry.wrap(App)

AppRegistry.registerComponent(appName, () => App);
