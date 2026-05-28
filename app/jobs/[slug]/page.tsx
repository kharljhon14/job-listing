import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getJobBySlug, getJobs } from '@/lib/jobs/repository';

type JobPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const jobs = await getJobs();

  return jobs.map((job) => ({
    slug: job.slug
  }));
}

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
      <Button
        asChild
        variant="ghost"
        className="w-fit"
      >
        <Link href="/">Back to jobs</Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{job.department}</Badge>
            <Badge variant="outline">{job.type}</Badge>
          </div>
          <CardTitle className="text-3xl">{job.title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">Placeholder job detail page for {job.location}.</p>

          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Reference</dt>
              <dd className="font-medium">{job.id}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Posted date</dt>
              <dd className="font-medium">{job.postedDate}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Closing date</dt>
              <dd className="font-medium">{job.closingDate ?? 'Open until filled'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Salary</dt>
              <dd className="font-medium">
                {job.salary.currency} {job.salary.min.toLocaleString()} -{' '}
                {job.salary.max.toLocaleString()}
              </dd>
            </div>
          </dl>

          <div
            className="text-muted-foreground [&_p]:leading-7"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />

          <div className="border-t pt-4">
            <Button
              type="button"
              size="lg"
            >
              Apply now
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
