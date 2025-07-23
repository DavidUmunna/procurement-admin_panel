import * as Sentry from "@sentry/react";

export const handleRBACError = (error) => {
  if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
    window.location.href = '/adminlogin';
  } else if (error.response?.status === 401 || error.response?.status === 403) {
    window.location.href = '/adminlogin'; 
  } else {
    Sentry.captureException(error);
  }
};