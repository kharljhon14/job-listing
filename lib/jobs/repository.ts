import { jobs } from './fixture';
import { Job } from './types';

export async function getJobs(): Promise<Job[]> {
  return [...jobs];
}

export async function getJobBySlug(slug: string): Promise<Job | undefined> {
  return jobs.find((job) => job.slug === slug);
}
