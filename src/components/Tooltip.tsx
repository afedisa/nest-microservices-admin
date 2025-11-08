import React from 'react';

type Props = {
  text: string;
  children: React.ReactNode;
  className?: string;
};

export default function Tooltip({ text, children, className }: Props) {
  return (
    <div className={`relative inline-block ${className ?? ''}`}>
      {children}
      <div className="opacity-0 pointer-events-none absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap rounded bg-gray-800 text-white text-xs px-2 py-1 transition-opacity duration-150 tooltip">
        {text}
      </div>
      <style>{`
        .relative:hover .tooltip { opacity: 1; pointer-events: auto; }
        .relative:focus-within .tooltip { opacity: 1; pointer-events: auto; }
      `}</style>
    </div>
  );
}
