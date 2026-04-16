import { Search, X } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
}

export function SearchInput({ value, onClear, className = '', ...props }: SearchInputProps) {
  return (
    <div className={`cv-search ${className}`.trim()}>
      <Search size={18} />
      <input type="text" value={value} {...props} />
      {value && onClear && (
        <button className="cv-search__clear" onClick={onClear} type="button" aria-label="Clear search">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
