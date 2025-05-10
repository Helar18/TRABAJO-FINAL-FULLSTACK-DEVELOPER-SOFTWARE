import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';

const Topbar = ({ role, onLogout }) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (role === 'admin') {
      setUserName(sessionStorage.getItem('userName') || 'Administrador');

    } else {
      const storedName = sessionStorage.getItem('userName'); // Asegúrate que sea 'userName'
      setUserName(storedName || 'Empleado');
    }
  }, [role]);

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#14B8A6', boxShadow: 3 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {role === 'admin' ? 'Panel de Administrador' : 'Panel de Empleado'}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: '#0f766e' }}>
            {userName.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="subtitle1" sx={{ color: 'white' }}>
            {userName}
          </Typography>
          <IconButton color="inherit" onClick={onLogout}>
            <ExitToApp />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
