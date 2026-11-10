import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AdminStagingApp } from './AdminStagingApp';
import './admin-staging.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminStagingApp />
  </StrictMode>,
);
