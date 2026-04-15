import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Drills } from './pages/drills/Drills';
import { Supplies } from './pages/supplies/Supplies';
import { Equipment } from './pages/equipment/Equipment';
import { Projects } from './pages/projects/Projects';
import { ProjectDetail } from './pages/projects/ProjectDetail';
import { Locations } from './pages/locations/Locations';
import { Colors } from './pages/colors/Colors';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="drills" element={<Drills />} />
          <Route path="supplies" element={<Supplies />} />
          <Route path="equipment" element={<Equipment />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="locations" element={<Locations />} />
          <Route path="colors" element={<Colors />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
