import { TrackingContext, shouldTrack } from './analytics';

describe('shouldTrack', () => {
  const visitor: TrackingContext = {
    devMode: false,
    hostname: 'almog-portfolio-tau.vercel.app',
    webdriver: false,
    optedOut: false,
  };

  it('counts a real visitor on the deployed site', () => {
    expect(shouldTrack(visitor)).toBe(true);
  });

  it.each<[string, Partial<TrackingContext>]>([
    ['dev builds', { devMode: true }],
    ['localhost', { hostname: 'localhost' }],
    ['127.0.0.1', { hostname: '127.0.0.1' }],
    ['automated browsers (Playwright e2e:prod runs)', { webdriver: true }],
    ['the owner after visiting with ?notrack', { optedOut: true }],
  ])('ignores %s', (_label, override) => {
    expect(shouldTrack({ ...visitor, ...override })).toBe(false);
  });
});
