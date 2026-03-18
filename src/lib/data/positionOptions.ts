import { formatYear } from '../date';

export const level = [
  { value: 'Bachelor', label: 'Bachelor' },
  { value: 'Master', label: 'Master' },
  { value: 'Doctorate', label: 'Doctorate' },
];

export const degree = [
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Information Technology', label: 'Information Technology' },
  { value: 'Information Systems', label: 'Information Systems' },
  { value: 'Software Engineering', label: 'Software Engineering' },
  { value: 'Computer Engineering', label: 'Computer Engineering' },
  { value: 'Industrial Technology', label: 'Industrial Technology' },
  { value: 'Civil Engineering', label: 'Civil Engineering' },
  { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
  { value: 'Electrical Engineering', label: 'Electrical Engineering' },
  { value: 'Electronics Engineering', label: 'Electronics Engineering' },
  { value: 'Secondary Education', label: 'Secondary Education' },
  { value: 'Hospitality Management', label: 'Hospitality Management' },
  { value: 'Business Administration', label: 'Business Administration' },
  { value: 'Accountancy', label: 'Accountancy' },
  { value: 'Architecture', label: 'Architecture' },
];

export const designation = [
  { value: 'Dean', label: 'Dean' },
  { value: 'Chairperson', label: 'Chairperson' },
  { value: 'Coordinator', label: 'Coordinator' },
];

export const rank = [
  { value: 'Professor IV', label: 'Professor IV' },
  { value: 'Professor III', label: 'Professor III' },
  { value: 'Professor II', label: 'Professor II' },
  { value: 'Professor I', label: 'Professor I' },
  { value: 'Associate Professor V', label: 'Associate Professor V' },
  { value: 'Associate Professor IV', label: 'Associate Professor IV' },
  { value: 'Associate Professor III', label: 'Associate Professor III' },
  { value: 'Associate Professor II', label: 'Associate Professor II' },
  { value: 'Associate Professor I', label: 'Associate Professor I' },
  { value: 'Assistant Professor IV', label: 'Assistant Professor IV' },
  { value: 'Assistant Professor III', label: 'Assistant Professor III' },
  { value: 'Assistant Professor II', label: 'Assistant Professor II' },
  { value: 'Assistant Professor I', label: 'Assistant Professor I' },
  { value: 'Professor', label: 'Professor' },
  { value: 'Instructor III', label: 'Instructor III' },
  { value: 'Instructor II', label: 'Instructor II' },
  { value: 'Instructor I', label: 'Instructor I' },
];

export const getYearRange = (floor = 1930) => {
  const currentYear = new Date().getFullYear();
  const count = currentYear - floor + 1;

  return Array.from({ length: count }, (_, i) => {
    const year = (currentYear - i).toString();
    return { value: year, label: year };
  });
};

export const years = getYearRange();
