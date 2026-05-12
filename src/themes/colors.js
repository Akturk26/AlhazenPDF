/**
 * Color Palettes for Dark & Light Themes
 */

export const darkTheme = {
  // Backgrounds
  bg: '#0E0F14',
  surface: '#16181F',
  surface2: '#1E2029',
  surface3: '#252830',
  
  // Borders
  border: 'rgba(255,255,255,0.07)',
  borderBright: 'rgba(255,255,255,0.12)',
  
  // Text
  text: '#F0F0F5',
  textSecondary: '#8A8D9E',
  textDim: '#555870',
  
  // Accent colors
  blue: '#4F6EF7',
  blueLight: '#7B93FF',
  blueDim: 'rgba(79,110,247,0.15)',
  blueDim2: 'rgba(79,110,247,0.08)',
  
  gold: '#C9A84C',
  goldDim: 'rgba(201,168,76,0.12)',
  
  green: '#3DBA7C',
  greenDim: 'rgba(61,186,124,0.12)',
  
  red: '#E05555',
  redDim: 'rgba(224,85,85,0.12)',
  
  orange: '#E0904A',
  orangeDim: 'rgba(224,144,74,0.12)',
  
  purple: '#9B6EF7',
  purpleDim: 'rgba(155,110,247,0.12)',
  
  // Gradients
  heroGradient: ['#1A1D2E', '#0E0F14'],
  ctaGradient: ['#4F6EF7', '#5E7AFF'],
};

export const lightTheme = {
  // Backgrounds
  bg: '#F9FAFB',
  surface: '#FFFFFF',
  surface2: '#F3F4F6',
  surface3: '#E5E7EB',
  
  // Borders
  border: 'rgba(0,0,0,0.08)',
  borderBright: 'rgba(0,0,0,0.12)',
  
  // Text
  text: '#111827',
  textSecondary: '#6B7280',
  textDim: '#9CA3AF',
  
  // Accent colors (same vibrant colors work for both)
  blue: '#4F46E5',
  blueLight: '#6366F1',
  blueDim: 'rgba(79,70,229,0.1)',
  blueDim2: 'rgba(79,70,229,0.05)',
  
  gold: '#C9A84C',
  goldDim: 'rgba(201,168,76,0.1)',
  
  green: '#10B981',
  greenDim: 'rgba(16,185,129,0.1)',
  
  red: '#EF4444',
  redDim: 'rgba(239,68,68,0.1)',
  
  orange: '#F59E0B',
  orangeDim: 'rgba(245,158,11,0.1)',
  
  purple: '#8B5CF6',
  purpleDim: 'rgba(139,92,246,0.1)',
  
  // Gradients
  heroGradient: ['#EEF2FF', '#F9FAFB'],
  ctaGradient: ['#4F46E5', '#6366F1'],
};

export const getTheme = (isDark) => {
  return isDark ? darkTheme : lightTheme;
};
