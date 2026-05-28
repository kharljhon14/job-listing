import type { Job } from './types';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

function mapEmploymentType(type: string) {
  switch (type) {
    case 'Full-time':
      return 'FULL_TIME';
    case 'Contract':
      return 'CONTRACTOR';
    default:
      return type.toUpperCase().replaceAll('-', '_').replaceAll(' ', '_');
  }
}

function buildJobLocation(location: string) {
  if (location === 'Remote (NZ)') {
    return undefined;
  }

  const [addressLocality, addressCountry = 'NZ'] = location
    .split(',')
    .map((part) => part.trim());

  return {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressLocality,
      addressCountry
    }
  };
}

export function buildJobPostingJsonLd(job: Job) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    identifier: {
      '@type': 'PropertyValue',
      name: 'Medenterprises',
      value: job.id
    },
    datePosted: job.postedDate,
    ...(job.closingDate ? { validThrough: job.closingDate } : {}),
    employmentType: mapEmploymentType(job.type),
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Medenterprises',
      sameAs: siteUrl
    },
    ...(job.location === 'Remote (NZ)'
      ? {
          jobLocationType: 'TELECOMMUTE',
          applicantLocationRequirements: {
            '@type': 'Country',
            name: 'New Zealand'
          }
        }
      : { jobLocation: buildJobLocation(job.location) }),
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: job.salary.currency,
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salary.min,
        maxValue: job.salary.max,
        unitText: 'YEAR'
      }
    }
  };

  return jsonLd;
}
