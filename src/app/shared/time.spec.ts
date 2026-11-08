import { timeAgo } from './time';

describe('timeAgo', () => {
  const now = new Date('2026-11-08T12:00:00Z');
  const before = (seconds: number) => new Date(now.getTime() - seconds * 1000);

  it.each([
    [10, 'just now'],
    [5 * 60, '5 minutes ago'],
    [3 * 3600, '3 hours ago'],
    [26 * 3600, 'yesterday'],
    [3 * 24 * 3600, '3 days ago'],
    [15 * 24 * 3600, '2 weeks ago'],
  ])('%i seconds ago → %s', (seconds, expected) => {
    expect(timeAgo(before(seconds), now)).toBe(expected);
  });
});
