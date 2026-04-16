import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  flat?: boolean;
}

export function Card({ flat, className = '', children, ...props }: CardProps) {
  return (
    <div className={`cv-card ${flat ? 'cv-card--flat' : ''} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

Card.Header = function CardHeader({ children, ...props }: CardSectionProps) {
  return (
    <div className="cv-card__header" {...props}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, ...props }: CardSectionProps) {
  return (
    <div className="cv-card__body" {...props}>
      {children}
    </div>
  );
};
