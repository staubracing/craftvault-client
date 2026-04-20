import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Diamond,
  Package,
  Wrench,
  FolderKanban,
  MapPin,
  Palette,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import './Layout.css';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/drills', label: 'Drills', icon: Diamond },
  { to: '/supplies', label: 'Supplies', icon: Package },
  { to: '/equipment', label: 'Equipment', icon: Wrench },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/locations', label: 'Locations', icon: MapPin },
  { to: '/colors', label: 'Colors', icon: Palette },
];

export function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">
          <Diamond size={24} />
          <h1>CraftVault</h1>
        </div>
        <div className="app-header__actions">
          <ThemeToggle />
        </div>
      </header>

      <div className="app-body">
        <nav className="app-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item--active' : ''}`
              }
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
