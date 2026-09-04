export type Theme = {
  background: string;
  card: string;
  text: string;
  subtext: string;
  primary: string;
  border: string;
  danger: string;
  success: string;
  warning: string;
};

export const lightTheme: Theme = {
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: '#111827',
  subtext: '#6B7280',
  primary: '#4F46E5',
  border: '#E5E7EB',
  danger: '#DC2626',
  success: '#16A34A',
  warning: '#D97706',
};

export const darkTheme: Theme = {
  background: '#0B1120',
  card: '#111827',
  text: '#F9FAFB',
  subtext: '#9CA3AF',
  primary: '#818CF8',
  border: '#1F2937',
  danger: '#F87171',
  success: '#4ADE80',
  warning: '#FBBF24',
};
