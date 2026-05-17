// Lightweight analytics wrapper. GA tag is loaded by the layout's <Script>;
// this module just queues events safely.

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const isAnalyticsAvailable = () =>
  typeof window !== 'undefined' &&
  typeof window.gtag === 'function' &&
  Array.isArray(window.dataLayer) &&
  GA_MEASUREMENT_ID;

const eventQueue = [];
let initialized = false;

export const trackEvent = (...args) => {
  if (!initialized) {
    eventQueue.push(args);
    return;
  }
  if (isAnalyticsAvailable()) {
    try { window.gtag(...args); } catch { /* noop */ }
  }
};

export const trackPageView = (path) => {
  if (!path || !GA_MEASUREMENT_ID) return;
  trackEvent('config', GA_MEASUREMENT_ID, {
    page_path: path,
    send_page_view: true,
  });
};

export const trackCustomEvent = (eventName, eventParams = {}) => {
  if (!eventName) return;
  trackEvent('event', eventName, eventParams);
};

if (typeof window !== 'undefined') {
  const init = () => {
    initialized = true;
    if (isAnalyticsAvailable()) {
      while (eventQueue.length > 0) {
        const args = eventQueue.shift();
        try { window.gtag(...args); } catch { /* noop */ }
      }
    } else {
      window.gtag = window.gtag || function noop() {};
      window.dataLayer = window.dataLayer || [];
    }
  };

  if (document.readyState === 'complete') init();
  else {
    window.addEventListener('load', init);
    setTimeout(init, 1000);
  }
}
