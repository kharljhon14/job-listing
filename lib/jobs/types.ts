export type JobSalary = {
  min: number;
  max: number;
  currency: string;
};

export type Job = {
  id: string;
  title: string;
  slug: string;
  location: string;
  type: string;
  department: string;
  postedDate: string;
  closingDate: string | null;
  salary: JobSalary;
  description: string;
  requirements: string[];
};
