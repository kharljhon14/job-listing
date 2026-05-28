'use client';

import { Button } from '@/components/ui/button';
import type { Job } from '@/lib/jobs/types';

type ApplyButtonProps = {
  job: Pick<Job, 'id' | 'title' | 'slug' | 'department' | 'location' | 'type'>;
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function ApplyButton({ job }: ApplyButtonProps) {
  const handleClick = () => {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({
      event: 'job_apply_click',
      job: {
        id: job.id,
        title: job.title,
        slug: job.slug,
        department: job.department,
        location: job.location,
        employmentType: job.type
      }
    });
  };

  return (
    <Button
      type="button"
      size="lg"
      onClick={handleClick}
    >
      Apply now
    </Button>
  );
}
