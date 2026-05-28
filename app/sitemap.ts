import type { MetadataRoute } from 'next';

import { getJobs } from '@/lib/jobs/repository';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getJobs();

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1
    },
    ...jobs.map((job) => ({
      url: `${siteUrl}/jobs/${job.slug}`,
      lastModified: job.postedDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8
    }))
  ];
}
