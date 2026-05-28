import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const dateFormatter = new Intl.DateTimeFormat('en-NZ', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
});

export function formatDate(date: string) {
  return dateFormatter.format(new Date(date));
}

const moneyFormatter = new Intl.NumberFormat('en-NZ');

export function formatSalary(min: number, max: number, currency: string) {
  return `${currency} ${moneyFormatter.format(min)} - ${moneyFormatter.format(max)}`;
}
