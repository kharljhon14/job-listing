import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center gap-5 px-6 py-16 text-center">
      <p className="text-sm font-medium uppercase tracking-[0.2rem] text-muted-foreground">404</p>
      <h1 className="text-4xl font-semibold tracking-tight">Job not found</h1>
      <p className="text-muted-foreground">
        The job listing you are looking for may have closed, moved, or never existed. Return to the
        home page to browse current roles.
      </p>
      <Button asChild>
        <Link href="/">Back to job listings</Link>
      </Button>
    </main>
  );
}
