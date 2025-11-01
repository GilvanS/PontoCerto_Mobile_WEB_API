
import React from 'react';
import { IconProps } from './Icon';

const CoffeeIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v2h-4v-2H5a2 2 0 01-2-2V10a2 2 0 012-2h2V4h4v4h2" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8v2" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8v2" />
  </svg>
);
// FIX: Add default export to allow other modules to import this component.
export default CoffeeIcon;