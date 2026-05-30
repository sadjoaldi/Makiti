import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",

  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Pas de session replay pour l'instant (léger + privacy)
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  // Filtrage des données sensibles avant envoi
  beforeSend(event) {
    // Supprime les données de requête potentiellement sensibles
    if (event.request?.data) {
      delete event.request.data;
    }
    if (event.request?.headers) {
      delete event.request.headers["authorization"];
      delete event.request.headers["cookie"];
    }
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
