import { isDevMode } from '@angular/core';
import { inject as injectVercelAnalytics } from '@vercel/analytics';

/** localStorage flag that excludes this browser from visitor counts. */
export const OPT_OUT_KEY = 'af-no-track';

export interface TrackingContext {
  devMode: boolean;
  hostname: string;
  /** True in Playwright/Selenium/Puppeteer — keeps automated test runs out of the numbers. */
  webdriver: boolean;
  optedOut: boolean;
}

/** Only real visitors on the deployed site are counted. */
export function shouldTrack(ctx: TrackingContext): boolean {
  const isLocal = ctx.hostname === 'localhost' || ctx.hostname === '127.0.0.1' || ctx.hostname === '';
  return !ctx.devMode && !isLocal && !ctx.webdriver && !ctx.optedOut;
}

/**
 * Reads `?notrack` / `?track` once, persists the choice, and strips the param from the URL
 * so an opted-out link is never accidentally shared.
 */
function readOptOut(): boolean {
  try {
    const url = new URL(location.href);
    if (url.searchParams.has('notrack')) localStorage.setItem(OPT_OUT_KEY, '1');
    if (url.searchParams.has('track')) localStorage.removeItem(OPT_OUT_KEY);
    if (url.searchParams.has('notrack') || url.searchParams.has('track')) {
      url.searchParams.delete('notrack');
      url.searchParams.delete('track');
      history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
    return localStorage.getItem(OPT_OUT_KEY) === '1';
  } catch {
    return false; // storage blocked (e.g. strict private mode) — treat as a normal visitor
  }
}

/** Starts Vercel Web Analytics (privacy-friendly, cookieless page-view counting). */
export function startAnalytics(): void {
  const ctx: TrackingContext = {
    devMode: isDevMode(),
    hostname: location.hostname,
    webdriver: navigator.webdriver === true,
    optedOut: readOptOut(),
  };
  if (shouldTrack(ctx)) injectVercelAnalytics({ mode: 'production' });
}
