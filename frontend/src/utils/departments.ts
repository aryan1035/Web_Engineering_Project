export const MEDICAL_DEPARTMENTS = [
  'Cardiology',
  'Dermatology',
  'Emergency',
  'Endocrinology',
  'Gastroenterology',
  'General Practice',
  'Neurology',
  'Obstetrics and Gynecology',
  'Oncology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Urology',
] as const;

export type Department = (typeof MEDICAL_DEPARTMENTS)[number];

export function getDepartmentLabel(value: string): string {
  return MEDICAL_DEPARTMENTS.includes(value as Department) ? value : value;
}
