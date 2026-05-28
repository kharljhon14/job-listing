# Medical Job Listing Site

The app reads a typed fixture through a repository layer, renders an index and dynamic job detail pages, includes technical SEO metadata, emits a GTM style apply event, and has unit/integration test coverage.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn UI components
- Vitest
- Testing Library

## Setup

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

## Live Site

```text
https://job-listing-rho-five.vercel.app/
```

## Scripts

```bash
pnpm dev       # start local development server
pnpm lint      # run ESLint
pnpm test      # run Vitest tests once
pnpm test:watch # run Vitest in watch mode
pnpm build     # create a production build
pnpm start     # run the production build locally
```

## Environment Variables

Set this in production so canonical URLs, Open Graph URLs, JSON-LD organization URLs, and sitemap URLs use the deployed origin:

```bash
NEXT_PUBLIC_SITE_URL=https://job-listing-rho-five.vercel.app
```

If unset, the app defaults to:

```text
http://localhost:3000
```

## Implemented Routes

- `/` renders the job listing index.
- `/jobs/[slug]` renders a statically generated job detail page.
- `/sitemap.xml` renders the sitemap.
- Unknown job slugs render the custom 404 UI through `notFound()`.

## Filtering

The index supports shareable URL filters for department and employment type.

Examples:

```text
/
/?department=Paediatrics
/?type=Full-time
/?department=Emergency%20Medicine&type=Full-time
```

## Data Layer

Job data is defined in:

```text
lib/jobs/fixture.ts
```

The rendering layer does not import the fixture directly. Pages call repository functions from:

```text
lib/jobs/repository.ts
```

Current repository functions:

- `getJobs()`
- `getJobBySlug(slug)`

The internal data model is typed in:

```text
lib/jobs/types.ts
```

## Replacing the Fixture With a Real Feed

A real external feed should be plugged in behind `lib/jobs/repository.ts` so page components do not change.

Recommended approach:

1. Fetch the external feed in the repository layer.
2. Validate the external response with a schema validator before rendering.
3. Normalize the external shape into the internal `Job` type.
4. Sanitize any HTML fields before passing them to UI components.
5. Keep repository functions stable so route code continues to call `getJobs()` and `getJobBySlug()`.

The current fixture description is rendered with `dangerouslySetInnerHTML` because the source is trusted local test data. A real feed must sanitize HTML before rendering.

## Rendering Strategy

The current implementation uses static generation for job detail pages:

```text
app/jobs/[slug]/page.tsx
```

`generateStaticParams()` prebuilds every job route. This is appropriate for a small public job feed where listings do not change on every request.

If connected to a real feed, the next step would be ISR:

- Use a `revalidate` interval for periodic refreshes, or
- Use webhook triggered revalidation when the external feed changes.

SSR would only be necessary if every request must reflect immediate feed changes or user-specific content.

## SEO

Implemented SEO pieces:

- Metadata API on the index page.
- Metadata API on job detail pages.
- Not-found metadata for invalid job slugs.
- Canonical URL on the index page.
- Canonical URL on job detail pages.
- Open Graph metadata on index and detail pages.
- `JobPosting` JSON-LD on each job detail page.
- Sitemap at `/sitemap.xml` including the index and all job detail URLs.

`JobPosting` structured data is built in:

```text
lib/jobs/structured-data.ts
```

It includes title, description, identifier, date posted, optional valid-through date, employment type, hiring organization, location or telecommute fields, and base salary.

## Analytics

The Apply button is a client component:

```text
components/apply-button.tsx
```

On click, it pushes a GTM-style event:

```ts
window.dataLayer.push({
  event: 'job_apply_click',
  job: {
    id,
    title,
    slug,
    department,
    location,
    employmentType
  }
});
```

In production, GTM would listen for `job_apply_click` and map the job fields into analytics tags or conversion events.

## Testing

Run tests:

```bash
pnpm test
```

Current tests:

- Unit tests for formatting utilities in `lib/utils.test.ts`.
- Route-level integration test for `app/jobs/[slug]/page.tsx`.

The integration test renders the page for `paediatrician` and asserts the title, location, department, requirements, and Apply button are present.

Latest local result:

```text
Test Files  2 passed
Tests       3 passed
```

## Validation Notes

`pnpm test` passes.

`pnpm lint` may still report issues from generated shadcn UI files that are not directly used by this exercise, such as generated carousel/mobile hook patterns. Focused linting has been run against the implemented app files while developing.

`pnpm build` should be checked before submission. If it fails on generated UI type definitions, remove unused generated components or align those components with the installed package versions.

## AI Usage

AI assistance was used to help plan the implementation, generate boilerplate documentation.

## Trade Offs

- The fixture is local and synchronous behind async repository functions. This keeps the page API close to a real feed without introducing unnecessary infrastructure.
- The HTML description is rendered directly because it is trusted fixture data. This is not production safe for untrusted feed content.
- The UI is intentionally simple and functional. More time would go into richer filter controls, empty states, and visual polish.
- Tests cover important formatter behavior and the main job detail route, but they are not exhaustive.
- Filtered index URLs use query parameters and keep the canonical URL pointed at `/`.

## Known Gaps

- No end-to-end browser tests are included.
- Feed validation and HTML sanitization are not implemented.
- Accessibility has not had a full audit beyond using semantic headings on the detail page.
- The generated UI component set should be cleaned up to remove unused files and avoid unrelated lint/type noise.

## Next Steps

1. Add an external feed adapter and schema validation.
2. Sanitize feed provided HTML before rendering descriptions.
3. Add tests for index filtering, detail navigation, 404 behavior, and Apply tracking.
4. Clean up unused generated UI components.

## Production Readiness

Before this could be considered production ready, it would still need:

- Real feed ingestion with validation and retries.
- HTML sanitization for feed descriptions.
- Monitoring and error reporting.
- Analytics consent handling.
- Robust application URL behavior for Apply clicks.
- Full accessibility review.
- CI checks for lint, typecheck, tests, and build.
