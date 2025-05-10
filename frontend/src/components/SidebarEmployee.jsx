import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, IconButton, Divider, Collapse, Typography } from '@mui/material';
import { Menu, ExitToApp, Dashboard, ShoppingCart, ExpandMore, ExpandLess, BarChart, Timeline, Person, ListAlt, Group, Storefront, Inventory, HelpOutline, ContactSupport, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const EmployeeSidebar = ({ onLogout, user }) => {  
  const [open, setOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Guardamos el nombre del empleado en sessionStorage solo si está disponible
    if (user && user.name) {
      sessionStorage.setItem('userName', user.name);
    }
  }, [user]);

  // Recuperamos el nombre del empleado desde sessionStorage para usarlo cuando lo necesitemos
  const savedUserName = sessionStorage.getItem('userName');
  const employeeName = savedUserName || 'Empleado'; // Si no hay nombre, se muestra 'Empleado'

  const toggleSidebar = () => setOpen(!open);
  const handleToggleMenu = (menuName) => setOpenMenu(prev => (prev === menuName ? null : menuName));

  return (
    <Box width={open ? 240 : 70} bgcolor="#14B8A6" color="white" height="100vh" display="flex" flexDirection="column" sx={{ transition: 'width 0.3s', boxShadow: 3, overflow: 'hidden' }}>
      {/* Barra superior */}
      <Box display="flex" justifyContent={open ? 'space-between' : 'center'} alignItems="center" p={2}>
        {open && <Typography variant="h6" fontWeight="bold">Empleado</Typography>} {/* Siempre mostrar "Empleado" */}
        <IconButton onClick={toggleSidebar} sx={{ color: 'white' }}>
          <Menu />
        </IconButton>
      </Box>

      <Divider sx={{ backgroundColor: 'white', opacity: 0.3 }} />

      {/* Menú de navegación */}
      <Box flex={1} sx={{
        overflowY: 'auto',
        '&::-webkit-scrollbar': { width: '6px' },
        '&::-webkit-scrollbar-thumb': { backgroundColor: '#0f766e', borderRadius: '4px' }
      }}>
        <List>
          {/* Menús desplegables */}
          <DropdownMenu
            open={open}
            isOpen={openMenu === 'inicio'}
            toggleOpen={() => handleToggleMenu('inicio')}
            icon={<Dashboard />}
            title="Inicio"
            items={[
              { label: 'Resumen general', icon: <Dashboard />, route: '/employee-dashboard' },
              { label: 'Actividad reciente', icon: <Timeline />, route: '/employee-dashboard/activity' },
              { label: 'Estadísticas', icon: <BarChart />, route: '/employee-dashboard/stats' },
            ]}
            navigate={navigate}
          />
          
          <DropdownMenu
            open={open}
            isOpen={openMenu === 'ventas'}
            toggleOpen={() => handleToggleMenu('ventas')}
            icon={<ShoppingCart />}
            title="Ventas"
            items={[
              { label: 'Nueva venta', icon: <ShoppingCart />, route: '/employee-dashboard/sales/new' },
              { label: 'Historial de ventas', icon: <ListAlt />, route: '/employee-dashboard/sales' },
            ]}
            navigate={navigate}
          />


          <DropdownMenu
            open={open}
            isOpen={openMenu === 'productos'}
            toggleOpen={() => handleToggleMenu('productos')}
            icon={<Storefront />}
            title="Productos"
            items={[
              { label: 'Ver productos', icon: <Storefront />, route: '/employee-dashboard/products' },
              { label: 'Detalles de producto', icon: <ListAlt />, route: '/employee-dashboard/products/details' },
            ]}
            navigate={navigate}
          />

          <DropdownMenu
            open={open}
            isOpen={openMenu === 'inventario'}
            toggleOpen={() => handleToggleMenu('inventario')}
            icon={<Inventory />}
            title="Inventario"
            items={[
              { label: 'Ver inventario', icon: <Inventory />, route: '/employee-dashboard/inventory' },
              { label: 'Stock bajo', icon: <BarChart />, route: '/employee-dashboard/inventory/low-stock' },
            ]}
            navigate={navigate}
          />

          <DropdownMenu
            open={open}
            isOpen={openMenu === 'perfil'}
            toggleOpen={() => handleToggleMenu('perfil')}
            icon={<Person />}
            title="Mi perfil"
            items={[
              { label: 'Ver perfil', icon: <Person />, route: '/employee-dashboard/profile' },
              { label: 'Cambiar contraseña', icon: <Lock />, route: '/employee-dashboard/profile/change-password' },
            ]}
            navigate={navigate}
          />

          <DropdownMenu
            open={open}
            isOpen={openMenu === 'ayuda'}
            toggleOpen={() => handleToggleMenu('ayuda')}
            icon={<HelpOutline />}
            title="Ayuda"
            items={[
              { label: 'Manual de usuario', icon: <HelpOutline />, route: '/employee-dashboard/help' },
              { label: 'Contactar soporte', icon: <ContactSupport />, route: '/employee-dashboard/support' },
            ]}
            navigate={navigate}
          />
        </List>
      </Box>

      {/* Botón de cerrar sesión */}
      <ListItem button onClick={onLogout} sx={listItemStyle}>
        <ListItemIcon sx={{ color: 'white' }}><ExitToApp /></ListItemIcon>
        {open && <ListItemText primary="Cerrar sesión" />}
      </ListItem>
    </Box>
  );
};

const DropdownMenu = ({ open, isOpen, toggleOpen, icon, title, items, navigate }) => (
  <>
    <ListItem button onClick={toggleOpen} sx={listItemStyle}>
      <ListItemIcon sx={{ color: 'white' }}>{icon}</ListItemIcon>
      <ListItemText primary={title} sx={{ display: open ? 'block' : 'none' }} />
      {open && (isOpen ? <ExpandLess /> : <ExpandMore />)}
    </ListItem>
    <Collapse in={isOpen} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {items.map((item) => (
          <ListItem key={item.route} button sx={{ ...listItemStyle, pl: 4 }} onClick={() => navigate(item.route)}>
            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} sx={{ display: open ? 'block' : 'none' }} />
          </ListItem>
        ))}
      </List>
    </Collapse>
  </>
);

const listItemStyle = {
  '&:hover': { backgroundColor: '#2dd4bf' },
  '&.Mui-selected': { backgroundColor: 'transparent' },
  cursor: 'pointer',
};

export default EmployeeSidebar;
