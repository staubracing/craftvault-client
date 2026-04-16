import type { HTMLAttributes } from 'react';

interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export function LoadingSpinner({ label = 'Loading...', ...props }: LoadingSpinnerProps) {
  return <div className="cv-spinner" role="status" aria-label={label} {...props} />;
}
