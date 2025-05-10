import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Typography,
  Paper,
  Container,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { addEmployee } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AddEmployee = ({ onAddEmployee }) => {
  const navigate = useNavigate();

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

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const peruDate = new Date().toLocaleDateString('en-CA', {
      timeZone: 'America/Lima',
    });
    setFormData((prev) => ({
      ...prev,
      fecha_ingreso: peruDate,
    }));
  }, []);

  const generarPassword = (dni, name) => {
    if (!dni || !name) return '';
    const primerNombre = name.trim().split(' ')[0];
    return `${dni}${primerNombre}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => {
      const updated = { ...prevState, [name]: value };

      if (updated.dni && updated.name) {
        updated.password = generarPassword(updated.dni, updated.name);
      } else {
        updated.password = '';
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newEmployee = {
        ...formData,
        activo: true,
        created_at: new Date().toISOString(),
      };

      const token = sessionStorage.getItem('authToken');
      if (!token) throw new Error('No se encontró el token de autenticación');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const data = await addEmployee(newEmployee, config);
      setSuccessMessage(data.message);

      const peruDate = new Date().toLocaleDateString('en-CA', {
        timeZone: 'America/Lima',
      });

      setFormData({
        name: '',
        email: '',
        dni: '',
        fecha_nacimiento: '',
        fecha_ingreso: peruDate,
        telefono: '',
        direccion: '',
        rol: '',
        salario: '',
        historial_trabajo: '',
        password: '',
      });
    } catch (error) {
      const backendMsg = error.response?.data?.message;
      setErrorMessage(
        backendMsg || 'Error al registrar empleado. Verifica los datos e intenta nuevamente.'
      );
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={4} sx={{ padding: 4, borderRadius: 3, position: 'relative' }}>
        {/* Botón de cierre que redirige al dashboard */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            color: 'gray',
            '&:hover': { backgroundColor: 'transparent' }
          }}
          onClick={() => navigate('/admin')}
        >
          <Close />
        </IconButton>

        <Typography variant="h5" gutterBottom align="center" fontWeight="bold" color="primary">
          Registro de Nuevo Empleado
        </Typography>

        <form onSubmit={handleSubmit} autoComplete="off">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
                autoComplete="off"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Correo Electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
                autoComplete="off"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="DNI"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                required
                fullWidth
                autoComplete="off"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha de Nacimiento"
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha de Ingreso"
                type="date"
                name="fecha_ingreso"
                value={formData.fecha_ingreso}
                InputLabelProps={{ shrink: true }}
                disabled
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Dirección"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Rol</InputLabel>
                <Select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  label="Rol"
                >
                  <MenuItem value="Empleado">Empleado</MenuItem>
                  <MenuItem value="Gerente">Gerente</MenuItem>
                </Select>
                <FormHelperText>Seleccione el rol del empleado</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Salario (S/.)"
                name="salario"
                type="number"
                value={formData.salario}
                onChange={handleChange}
                required
                fullWidth
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
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Contraseña Generada"
                name="password"
                value={formData.password}
                disabled
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                sx={{ py: 1.5, fontWeight: 'bold', fontSize: '16px' }}
              >
                Registrar Empleado
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Snackbar de éxito */}
      <Snackbar open={!!successMessage} autoHideDuration={4000} onClose={() => setSuccessMessage('')}>
        <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Snackbar de error */}
      <Snackbar open={!!errorMessage} autoHideDuration={4000} onClose={() => setErrorMessage('')}>
        <Alert onClose={() => setErrorMessage('')} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddEmployee;
