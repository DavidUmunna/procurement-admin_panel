import * as Sentry from '@sentry/react';
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "https://70c4617b75c9227dfdfa5c8222db19d5@o4509425534042112.ingest.de.sentry.io/4509425539416144",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: "production", // optional
});
