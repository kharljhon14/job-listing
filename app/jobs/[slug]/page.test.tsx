import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import JobPage from './page';

describe('job detail route', () => {
  it('renders the selected job details and apply button', async () => {
    const page = await JobPage({
      params: Promise.resolve({ slug: 'paediatrician' })
    });

    render(page);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Paediatrician' })
    ).toBeInTheDocument();
    expect(screen.getByText('Auckland, NZ')).toBeInTheDocument();
    expect(screen.getByText('Paediatrics')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Fellowship of the Royal Australasian College of Physicians (FRACP) or equivalent'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply now' })).toBeInTheDocument();
  });
});
