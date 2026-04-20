import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from './ui/Button';
import { useTheme, type ThemePreference } from '../hooks/useTheme';

const CYCLE: ThemePreference[] = ['light', 'dark', 'system'];

const icons = { light: Sun, dark: Moon, system: Monitor } as const;

const labels: Record<ThemePreference, string> = {
  light: 'Switch to dark mode',
  dark: 'Switch to system mode',
  system: 'Switch to light mode',
};

export function ThemeToggle() {
  const { preference, setTheme } = useTheme();

  const nextIndex = (CYCLE.indexOf(preference) + 1) % CYCLE.length;
  const next = CYCLE[nextIndex];
  const Icon = icons[preference];

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(next)}
      aria-label={labels[preference]}
      title={labels[preference]}
    >
      <Icon size={18} />
    </Button>
  );
}
