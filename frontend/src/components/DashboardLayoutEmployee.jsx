    import React from 'react';
    import { Box, CssBaseline } from '@mui/material';
    import { Outlet } from 'react-router-dom';

    import SidebarEmployee from './SidebarEmployee';
    import Topbar from './Topbar';

    const DashboardLayoutEmployee = ({ role, onLogout }) => {
    return (
        <>
        <CssBaseline />
        <Box sx={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar Empleado */}
            <SidebarEmployee role={role} onLogout={onLogout} />

            {/* Área principal con el contenido */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Topbar */}
            <Topbar role={role} onLogout={onLogout} />

            {/* Contenido dinámico */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
                <Outlet />
            </Box>
            </Box>
        </Box>
        </>
    );
    };

    export default DashboardLayoutEmployee;
