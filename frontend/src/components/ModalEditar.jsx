import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Box,
} from '@mui/material';
import { editEmployee } from '../services/api';

const ModalEditar = ({ open, onClose, employee, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dni: '',
    fecha_nacimiento: '',
    fecha_ingreso: '',
    telefono: '',
    direccion: '',
    rol: '',
    salario: '',
    historial_trabajo: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        dni: employee.dni || '',
        fecha_nacimiento: employee.fecha_nacimiento ? employee.fecha_nacimiento.split('T')[0] : '',
        fecha_ingreso: employee.fecha_ingreso ? employee.fecha_ingreso.split('T')[0] : '',
        telefono: employee.telefono || '',
        direccion: employee.direccion || '',
        rol: employee.rol || '',
        salario: employee.salario || '',
        historial_trabajo: employee.historial_trabajo || '',
        password: employee.password || '',
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) throw new Error('Token no encontrado');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { password, ...dataToUpdate } = formData;

      const updatedEmployee = await editEmployee(employee.id, dataToUpdate, config);

      onUpdate(updatedEmployee); // Esto muestra la alerta en el componente padre
      onClose(); // Primero cerramos el modal

    } catch (error) {
      console.error('Error al actualizar el empleado:', error);
      alert('Error al actualizar el empleado. Revisa la consola.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 1301 }}
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
      BackdropProps={{
        sx: { backgroundColor: 'rgba(0, 0, 0, 0.3)' },
      }}
    >
      <DialogTitle>Editar Empleado</DialogTitle>
      <DialogContent sx={{ padding: 3, maxHeight: '80vh', overflowY: 'auto' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nombre"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{ marginTop: 1 }} // Espaciado adicional en la parte superior
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Correo Electrónico"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{ marginTop: 1 }} // Espaciado adicional en la parte superior
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="DNI"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{ marginTop: 1 }} // Espaciado adicional en la parte superior
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Fecha de Nacimiento"
                  type="date"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ marginTop: 1 }} // Espaciado adicional en la parte superior
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  fullWidth
                  sx={{ marginTop: 1 }} // Espaciado adicional en la parte superior
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Rol"
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  fullWidth
                  sx={{ marginTop: 1 }} // Espaciado adicional en la parte superior
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Salario"
                  name="salario"
                  value={formData.salario}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{ marginTop: 1 }} // Espaciado adicional en la parte superior
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Dirección"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  fullWidth
                  sx={{ marginTop: 1 }} // Espaciado adicional en la parte superior
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Historial de Trabajo"
                  name="historial_trabajo"
                  multiline
                  rows={3}
                  value={formData.historial_trabajo}
                  onChange={handleChange}
                  fullWidth
                  sx={{ marginTop: 1 }} // Espaciado adicional en la parte superior
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Contraseña Generada"
                  name="password"
                  value={formData.password}
                  disabled
                  fullWidth
                  sx={{ marginTop: 1 }} // Espaciado adicional en la parte superior
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit" fullWidth>
                  Guardar Cambios
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEditar;
