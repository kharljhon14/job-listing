import Link from 'next/link';
import type { Metadata } from 'next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getJobs } from '@/lib/jobs/repository';
import { formatDate, formatSalary } from '@/lib/utils';

interface HomePageProps {
  searchParams: Promise<{
    department?: string;
    type?: string;
  }>;
}

export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  await searchParams;
  return {
    title: 'Medical careers | Job listings',
    description:
      'Browse current clinical job listings across New Zealand, including location, department, employment type, and role details.',
    openGraph: {
      title: 'Medical careers | Job listings',
      description:
        'Browse current clinical job listings across New Zealand, including location, department, employment type, and role details.',
      type: 'website',
      url: '/'
    },
    alternates: {
      canonical: '/'
    }
  };
}

export default async function Home() {
  const jobs = await getJobs();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
      <section className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2rem] text-muted-foreground">
          Medical careers
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Job listings</h1>
        <p className="max-w-2xl text-muted-foreground">
          Browse current clinical roles across New Zealand. Select a listing to view the full
          description, requirements, and application details.
        </p>
      </section>

      <section className="grid gap-4">
        {jobs.map((job) => (
          <Card
            key={job.id}
            className="transition hover:ring-foreground/25"
          >
            <CardHeader>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{job.department}</Badge>
                <Badge variant="outline">{job.type}</Badge>
              </div>
              <CardTitle className="text-xl">
                <Link
                  href={`/jobs/${job.slug}`}
                  className="hover:underline"
                >
                  {job.title}
                </Link>
              </CardTitle>
              <CardDescription>
                {job.location} · Posted {formatDate(job.postedDate)}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div
                className="max-w-3xl text-muted-foreground [&_p]:leading-7"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />

              <dl className="grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-muted-foreground">Salary</dt>
                  <dd className="font-medium">
                    {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Closing date</dt>
                  <dd className="font-medium">
                    {job.closingDate ? formatDate(job.closingDate) : 'Open until filled'}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Reference</dt>
                  <dd className="font-medium">{job.id}</dd>
                </div>
              </dl>

              <Button asChild>
                <Link href={`/jobs/${job.slug}`}>View role</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
