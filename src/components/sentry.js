// src/sentry.js
import * as Sentry from '@sentry/react';
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: 'https://your-dsn@sentry.io/project-id',
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});
