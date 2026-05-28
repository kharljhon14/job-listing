import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ApplyButton } from '@/components/apply-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getJobBySlug, getJobs } from '@/lib/jobs/repository';
import { buildJobPostingJsonLd } from '@/lib/jobs/structured-data';
import { formatDate, formatSalary } from '@/lib/utils';

type JobPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return {
      title: 'Job not found',
      description: 'The requested job listing could not be found.',
      robots: { index: false, follow: false }
    };
  }

  const title = `${job.title} | Medical Jobs NZ`;
  const description = `${job.title} role in ${job.department}, based in ${job.location}. View employment type, salary range, requirements, and application details.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/jobs/${job.slug}`
    },
    alternates: {
      canonical: `/jobs/${job.slug}`
    }
  };
}

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

  const jsonLd = buildJobPostingJsonLd(job);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Button
        asChild
        variant="ghost"
        className="w-fit"
      >
        <Link href="/">Back to jobs</Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className="text-3xl">{job.title}</h1>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">Location</dt>
              <dd className="font-medium">{job.location}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Employment type</dt>
              <dd className="font-medium">{job.type}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Department</dt>
              <dd className="font-medium">{job.department}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Reference</dt>
              <dd className="font-medium">{job.id}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Posted date</dt>
              <dd className="font-medium">{formatDate(job.postedDate)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Closing date</dt>
              <dd className="font-medium">
                {job.closingDate ? formatDate(job.closingDate) : 'Open until filled'}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Salary</dt>
              <dd className="font-medium">
                {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
              </dd>
            </div>
          </dl>

          <section className="space-y-3 border-t pt-4">
            <h2 className="text-xl font-semibold">About the role</h2>
            <div
              className="text-muted-foreground [&_p]:leading-7"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </section>

          <section className="space-y-3 border-t pt-4">
            <h2 className="text-xl font-semibold">Requirements</h2>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              {job.requirements.map((requirement) => (
                <li key={requirement}>{requirement}</li>
              ))}
            </ul>
          </section>

          <div className="border-t pt-4">
            <ApplyButton
              job={{
                id: job.id,
                title: job.title,
                slug: job.slug,
                department: job.department,
                location: job.location,
                type: job.type
              }}
            />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
