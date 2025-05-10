import React, { useState } from 'react';
import {
  Box, List, ListItem, ListItemIcon, ListItemText,
  IconButton, Divider, Collapse
} from '@mui/material';
import {
  Dashboard, People, ShoppingCart, ExitToApp, Menu,
  ExpandMore, ExpandLess, Store, Assessment, Settings,
  Group, PersonAdd, ListAlt, Inventory, BarChart, SettingsApplications, Business, Timeline, Person
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({ onLogout }) => {
  const [open, setOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => setOpen(!open);

  const handleToggleMenu = (menuName) => {
    setOpenMenu(prev => prev === menuName ? null : menuName);
  };

  return (
    <Box
      width={open ? 240 : 70}
      bgcolor="#14B8A6"
      color="white"
      height="100vh"
      display="flex"
      flexDirection="column"
      sx={{
        transition: 'width 0.3s',
        boxShadow: 3,
        overflow: 'hidden'
      }}
    >
      {/* Top */}
      <Box display="flex" justifyContent={open ? 'space-between' : 'center'} alignItems="center" p={2}>
        {open && <Box fontSize="1.3rem" fontWeight="bold">Admin</Box>}
        <IconButton onClick={toggleSidebar} sx={{ color: 'white' }}>
          <Menu />
        </IconButton>
      </Box>

      <Divider sx={{ backgroundColor: 'white', opacity: 0.3 }} />

      {/* Scrollable menu */}
      <Box flex={1} sx={{
        overflowY: 'auto',
        '&::-webkit-scrollbar': { width: '6px' },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#0f766e',
          borderRadius: '4px',
        }
      }}>
        <List>
          {/* INICIO */}
          <DropdownMenu
            open={open}
            isOpen={openMenu === 'inicio'}
            toggleOpen={() => handleToggleMenu('inicio')}
            icon={<Dashboard />}
            title="Inicio"
            items={[
              { label: 'Resumen general', icon: <Dashboard />, route: '/admin-dashboard' },
              { label: 'Actividad reciente', icon: <Timeline />, route: '/admin-dashboard/activity' },
              { label: 'Estadísticas', icon: <BarChart />, route: '/admin-dashboard/stats' },
            ]}
            navigate={navigate}
          />

          {/* EMPLEADOS */}
          <DropdownMenu
            open={open}
            isOpen={openMenu === 'empleados'}
            toggleOpen={() => handleToggleMenu('empleados')}
            icon={<People />}
            title="Empleados"
            items={[
              { label: 'Agregar Empleado', icon: <PersonAdd />, route: '/admin-dashboard/add-employee' },
              { label: 'Ver Empleados', icon: <Group />, route: '/admin-dashboard/employees' },

            ]}
            navigate={navigate}
          />

          {/* VENTAS */}
          <DropdownMenu
            open={open}
            isOpen={openMenu === 'ventas'}
            toggleOpen={() => handleToggleMenu('ventas')}
            icon={<ShoppingCart />}
            title="Ventas"
            items={[
              { label: 'Todas las ventas', icon: <ListAlt />, route: '/admin-dashboard/sales' },
              { label: 'Nueva venta', icon: <ShoppingCart />, route: '/admin-dashboard/sales/new' },
              { label: 'Ventas canceladas', icon: <ExitToApp />, route: '/admin-dashboard/sales/cancelled' },
            ]}
            navigate={navigate}
          />

          {/* CLIENTES */}
          <DropdownMenu
            open={open}
            isOpen={openMenu === 'clientes'}
            toggleOpen={() => handleToggleMenu('clientes')}
            icon={<Group />}
            title="Clientes"
            items={[
              { label: 'Lista de Clientes', icon: <Group />, route: '/admin-dashboard/clients' },
              { label: 'Agregar Cliente', icon: <PersonAdd />, route: '/admin-dashboard/clients/new' },
              { label: 'Segmentación', icon: <BarChart />, route: '/admin-dashboard/clients/segments' },
            ]}
            navigate={navigate}
          />

          {/* PRODUCTOS */}
          <DropdownMenu
            open={open}
            isOpen={openMenu === 'productos'}
            toggleOpen={() => handleToggleMenu('productos')}
            icon={<Store />}
            title="Productos"
            items={[
              { label: 'Agregar producto', icon: <PersonAdd />, route: '/admin-dashboard/products/new' },
              { label: 'Todos los productos', icon: <ListAlt />, route: '/admin-dashboard/products' },
              { label: 'Categorías', icon: <Store />, route: '/admin-dashboard/products/categories' },
              { label: 'Inventario', icon: <Inventory />, route: '/admin-dashboard/products/inventory' },
            ]}
            navigate={navigate}
          />

          {/* REPORTES */}
          <DropdownMenu
            open={open}
            isOpen={openMenu === 'reportes'}
            toggleOpen={() => handleToggleMenu('reportes')}
            icon={<Assessment />}
            title="Reportes"
            items={[
              { label: 'Ventas por fecha', icon: <BarChart />, route: '/admin-dashboard/reports/sales' },
              { label: 'Productos vendidos', icon: <Store />, route: '/admin-dashboard/reports/products' },
              { label: 'Clientes frecuentes', icon: <Group />, route: '/admin-dashboard/reports/customers' },
              { label: 'Comparativo mensual', icon: <Assessment />, route: '/admin-dashboard/reports/comparison' },
            ]}
            navigate={navigate}
          />

          {/* CONFIGURACIÓN */}
          <DropdownMenu
            open={open}
            isOpen={openMenu === 'config'}
            toggleOpen={() => handleToggleMenu('config')}
            icon={<Settings />}
            title="Configuración"
            items={[
              { label: 'Mi perfil', icon: <Person />, route: '/admin-dashboard/profile' },
              { label: 'Datos de la empresa', icon: <Business />, route: '/admin-dashboard/settings/company' },
              { label: 'Parámetros del sistema', icon: <SettingsApplications />, route: '/admin-dashboard/settings/system' },
              { label: 'Seguridad y usuarios', icon: <People />, route: '/admin-dashboard/settings/security' },
            ]}
            navigate={navigate}
          />
        </List>
      </Box>

      {/* CERRAR SESIÓN */}
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
      {open && <ListItemText primary={title} />}
      {open && (isOpen ? <ExpandLess /> : <ExpandMore />)}
    </ListItem>

    <Collapse in={isOpen} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {items.map((item, idx) => (
          <ListItem
            key={`${title}-${idx}`}
            button
            sx={{ ...listItemStyle, pl: 4 }}
            onClick={() => navigate(item.route)}
          >
            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
            {open && <ListItemText primary={item.label} />}
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

export default AdminSidebar;
