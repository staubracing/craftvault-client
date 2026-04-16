import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  color: string;
  onClick?: () => void;
}

export function StatCard({ icon: Icon, label, value, color, onClick }: StatCardProps) {
  return (
    <div
      className={`cv-stat ${onClick ? 'cv-stat--clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      <div className="cv-stat__icon" style={{ background: `${color}15`, color }}>
        <Icon size={22} />
      </div>
      <div className="cv-stat__content">
        <div className="cv-stat__value">{value}</div>
        <div className="cv-stat__label">{label}</div>
      </div>
    </div>
  );
}
