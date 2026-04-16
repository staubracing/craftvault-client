import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Diamond,
  Package,
  Wrench,
  FolderKanban,
  MapPin,
} from 'lucide-react';
import {
  drillsApi,
  suppliesApi,
  equipmentApi,
  projectsApi,
  zonesApi,
} from '../../api';
import type { Project } from '../../types';
import { StatCard, LoadingSpinner } from '../../components/ui';
import './Dashboard.css';

interface DashboardStats {
  drills: number;
  supplies: number;
  equipment: number;
  projects: number;
  zones: number;
  activeProjects: Project[];
}

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    drills: 0,
    supplies: 0,
    equipment: 0,
    projects: 0,
    zones: 0,
    activeProjects: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      drillsApi.getAll(),
      suppliesApi.getAll(),
      equipmentApi.getAll(),
      projectsApi.getAll(),
      zonesApi.getAll(),
    ])
      .then(([drills, supplies, equipment, projects, zones]) => {
        setStats({
          drills: drills.data.length,
          supplies: supplies.data.length,
          equipment: equipment.data.filter((e) => e.status !== 'retired').length,
          projects: projects.data.length,
          zones: zones.data.length,
          activeProjects: projects.data
            .filter((p) => p.status === 'in_progress')
            .slice(0, 5),
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="page-error">Failed to load dashboard: {error}</div>;

  const statCards = [
    {
      icon: Diamond,
      label: 'Drills',
      value: stats.drills,
      color: '#7c3aed',
      to: '/drills',
    },
    {
      icon: Package,
      label: 'Supplies',
      value: stats.supplies,
      color: '#14b8a6',
      to: '/supplies',
    },
    {
      icon: Wrench,
      label: 'Equipment',
      value: stats.equipment,
      color: '#f59e0b',
      to: '/equipment',
    },
    {
      icon: FolderKanban,
      label: 'Projects',
      value: stats.projects,
      color: '#ec4899',
      to: '/projects',
    },
    {
      icon: MapPin,
      label: 'Zones',
      value: stats.zones,
      color: '#f43f5e',
      to: '/locations',
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Your craft inventory at a glance</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {statCards.map(({ icon, label, value, color, to }) => (
          <StatCard
            key={to}
            icon={icon}
            label={label}
            value={value}
            color={color}
            onClick={() => navigate(to)}
          />
        ))}
      </div>

      {stats.activeProjects.length > 0 && (
        <div className="dashboard-section">
          <h2>Active Projects</h2>
          <div className="dashboard-projects">
            {stats.activeProjects.map((project) => (
              <div
                key={project.id}
                className="dashboard-project-item"
                onClick={() => navigate(`/projects/${project.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') navigate(`/projects/${project.id}`);
                }}
              >
                <div className="dashboard-project-item__name">{project.name}</div>
                <div className="dashboard-project-item__progress">
                  <div className="dashboard-progress-bar">
                    <div
                      className="dashboard-progress-bar__fill"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span>{project.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
