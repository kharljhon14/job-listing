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

function buildFilterHref(filters: { department?: string; type?: string }) {
  const params = new URLSearchParams();

  if (filters.department) {
    params.set('department', filters.department);
  }

  if (filters.type) {
    params.set('type', filters.type);
  }

  const query = params.toString();

  return query ? `/?${query}` : '/';
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

export default async function Home({ searchParams }: HomePageProps) {
  const { department, type } = await searchParams;
  const jobs = await getJobs();
  const departments = [...new Set(jobs.map((job) => job.department))].sort();
  const employmentTypes = [...new Set(jobs.map((job) => job.type))].sort();
  const filteredJobs = jobs.filter((job) => {
    const matchesDepartment = department ? job.department === department : true;
    const matchesType = type ? job.type === type : true;

    return matchesDepartment && matchesType;
  });
  const hasActiveFilters = Boolean(department || type);

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

      <section
        aria-label="Job filters"
        className="space-y-4 rounded-xl border bg-card p-4"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Filter jobs</h2>
            <p className="text-sm text-muted-foreground">
              Showing {filteredJobs.length} of {jobs.length} roles
            </p>
          </div>

          {hasActiveFilters ? (
            <Button
              asChild
              variant="ghost"
              className="w-fit"
            >
              <Link href="/">Clear filters</Link>
            </Button>
          ) : null}
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <p className="text-sm font-medium">Department</p>
            <div className="flex flex-wrap gap-2">
              <Button
                asChild
                size="sm"
                variant={department ? 'outline' : 'default'}
              >
                <Link href={buildFilterHref({ type })}>All departments</Link>
              </Button>
              {departments.map((option) => (
                <Button
                  asChild
                  key={option}
                  size="sm"
                  variant={department === option ? 'default' : 'outline'}
                >
                  <Link href={buildFilterHref({ department: option, type })}>{option}</Link>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Employment type</p>
            <div className="flex flex-wrap gap-2">
              <Button
                asChild
                size="sm"
                variant={type ? 'outline' : 'default'}
              >
                <Link href={buildFilterHref({ department })}>All types</Link>
              </Button>
              {employmentTypes.map((option) => (
                <Button
                  asChild
                  key={option}
                  size="sm"
                  variant={type === option ? 'default' : 'outline'}
                >
                  <Link href={buildFilterHref({ department, type: option })}>{option}</Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        {filteredJobs.map((job) => (
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

        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="space-y-3 py-8">
              <h2 className="text-xl font-semibold">No matching jobs</h2>
              <p className="text-muted-foreground">
                No current roles match those filters. Clear filters to view every listing.
              </p>
              <Button asChild>
                <Link href="/">Clear filters</Link>
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </section>
    </main>
  );
}
