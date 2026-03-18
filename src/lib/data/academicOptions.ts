export const courses = [
  { value: 'Bachelor of Science in Industrial Technology', label: 'BSIT' },
  { value: 'Bachelor of Industrial Technology', label: 'BIndTech' },
];

// Majors mapped by course
export const majorsByCourse: Record<
  string,
  { value: string; label: string }[]
> = {
  'Bachelor of Science in Industrial Technology': [
    { value: 'Automotive Technology', label: 'Automotive Technology' },
    { value: 'Mechanical Technology', label: 'Mechanical Technology' },
    { value: 'Civil Technology', label: 'Civil Technology' },
    {
      value: 'Architectural Drafting Technology',
      label: 'Architectural Drafting Technology',
    },
    { value: 'Electrical Technology', label: 'Electrical Technology' },
    { value: 'Electronics Technology', label: 'Electronics Technology' },
  ],
  'Bachelor of Industrial Technology': [
    { value: 'Culinary Technology', label: 'Culinary Technology' },
    {
      value: 'Apparel and Fashion Technology',
      label: 'Apparel and Fashion Technology',
    },
    {
      value: 'Beauty Care and Wellness Technology',
      label: 'Beauty Care and Wellness Technology',
    },
  ],
};

// All majors (for fallback if no course selected)
export const allMajors = [
  ...majorsByCourse['Bachelor of Science in Industrial Technology'],
  ...majorsByCourse['Bachelor of Industrial Technology'],
];

export const years = [
  { value: '1', label: '1st Year' },
  { value: '2', label: '2nd Year' },
  { value: '3', label: '3rd Year' },
  { value: '4', label: '4th Year' },
];

export const sections = [
  { value: 'A', label: 'Section A' },
  { value: 'B', label: 'Section B' },
];
