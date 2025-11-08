import React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
  inline?: boolean;
  htmlFor?: string;
};

export default function FormLabel({ children, className = '', inline = false, htmlFor }: Props) {
  const base = inline
    ? 'inline-flex items-center text-base font-semibold text-gray-900'
    : 'block text-base font-semibold text-gray-900 text-left';

  return (
    <label htmlFor={htmlFor} className={`${base} ${className}`.trim()}>
      {children}
    </label>
  );
}
