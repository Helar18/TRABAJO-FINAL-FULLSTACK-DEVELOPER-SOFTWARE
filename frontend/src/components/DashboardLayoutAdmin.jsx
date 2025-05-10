import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';

import SidebarAdmin from './SidebarAdmin';
import Topbar from './Topbar';

const DashboardLayoutAdmin = ({ role, onLogout }) => {
  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        {/* Sidebar */}
        <SidebarAdmin role={role} onLogout={onLogout} />

        {/* Contenido principal */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Barra superior */}
          <Topbar role={role} onLogout={onLogout} />

          {/* Área dinámica de contenido */}
          <Box component="main" sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default DashboardLayoutAdmin;
