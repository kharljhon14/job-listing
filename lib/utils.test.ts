import { describe, expect, it } from 'vitest';

import { formatDate, formatSalary } from './utils';

describe('format utilities', () => {
  it('formats ISO dates for New Zealand readers', () => {
    expect(formatDate('2026-04-01')).toBe('1 Apr 2026');
  });

  it('formats a salary range with currency, minimum, and maximum', () => {
    const result = formatSalary(220000, 280000, 'NZD');

    expect(result).toBe('NZD 220,000 - 280,000');
  });
});
