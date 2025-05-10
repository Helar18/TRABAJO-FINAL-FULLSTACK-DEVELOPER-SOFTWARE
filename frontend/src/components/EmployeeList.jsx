import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  Divider,
  Button,
  Tooltip,
  CircularProgress,
  Grid,
  Snackbar,
  Slide,
  Alert,
} from '@mui/material';
import { Edit, Delete, Close, Info } from '@mui/icons-material';
import { getEmployees, deleteEmployee } from '../services/api';
import ModalEditar from './ModalEditar';

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

const EmployeeList = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [action, setAction] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [showAlertEdit, setShowAlertEdit] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('authToken');

      if (!token) throw new Error('No se encontró el token de autenticación');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const data = await getEmployees(config);
      setEmployees(data.employees || data);
    } catch (error) {
      console.error('Error cargando empleados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleOpenModal = (action, employee = null) => {
    setAction(action);
    setSelectedEmployee(employee);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEmployee(null);
  };

  const handleOpenInfoModal = (employee) => {
    setSelectedEmployee(employee);
    setOpenInfoModal(true);
  };

  const handleCloseInfoModal = () => {
    setOpenInfoModal(false);
    setSelectedEmployee(null);
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-PE');
  };

  const handleCloseTable = () => {
    setShowTable(false);
    navigate('/dashboard');
  };

  const handleUpdateEmployee = async (updatedEmployee) => {
    await loadEmployees(); // Vuelve a cargar la lista desde la API
    handleCloseModal();
    setShowAlertEdit(true); // no necesitas el timeout
  };
  

  // Función para eliminar con confirmación
  const confirmDeleteEmployee = (employee) => {
    setSelectedEmployee(employee);
    setConfirmDeleteOpen(true);
  };

  const handleCancelDelete = () => {
    setSelectedEmployee(null);
    setConfirmDeleteOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = sessionStorage.getItem('authToken');

      if (!token) throw new Error('No se encontró el token de autenticación');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await deleteEmployee(selectedEmployee.id, config);

      setEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp.id !== selectedEmployee.id)
      );
      setConfirmDeleteOpen(false);
      setSelectedEmployee(null);
      setShowAlertDelete(true);
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      alert('Error eliminando el empleado. Revisa consola.');
    }
  };

  return (
    <div>
      <Typography variant="h4" align="center" sx={{ margin: '20px 0' }}>
        Lista de Empleados
      </Typography>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <IconButton onClick={handleCloseTable} sx={{ color: 'gray' }}>
          <Close />
        </IconButton>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : (
        showTable && (
          <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Cargo</TableCell>
                  <TableCell>Fecha de Ingreso</TableCell>
                  <TableCell>Más Información</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.rol}</TableCell>
                    <TableCell>{formatFecha(employee.fecha_ingreso)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleOpenInfoModal(employee)}
                      >
                        <Info sx={{ marginRight: 1 }} />
                        Más Información
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Box display="flex">
                        <Tooltip title="Editar">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenModal('edit', employee)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            color="error"
                            onClick={() => confirmDeleteEmployee(employee)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}

      {/* Modal de más información */}
      <Dialog open={openInfoModal} onClose={handleCloseInfoModal} maxWidth="md" fullWidth>
        <DialogTitle>Más Información de {selectedEmployee?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6" color="primary" sx={{ marginBottom: 2 }}>
              Detalles del Empleado
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1"><strong>Email:</strong> {selectedEmployee?.email}</Typography>
                <Typography variant="body1"><strong>DNI:</strong> {selectedEmployee?.dni}</Typography>
                <Typography variant="body1"><strong>Fecha de Nacimiento:</strong> {selectedEmployee?.fecha_nacimiento ? formatFecha(selectedEmployee?.fecha_nacimiento) : 'No disponible'}</Typography>
                <Typography variant="body1"><strong>Teléfono:</strong> {selectedEmployee?.telefono}</Typography>
                <Typography variant="body1"><strong>Dirección:</strong> {selectedEmployee?.direccion}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1"><strong>Cargo:</strong> {selectedEmployee?.rol}</Typography>
                <Typography variant="body1"><strong>Salario:</strong> S/. {selectedEmployee?.salario}</Typography>
                <Typography variant="body1"><strong>Historial de Trabajo:</strong> {selectedEmployee?.historial_trabajo || 'No disponible'}</Typography>
                <Typography variant="body1"><strong>Estado:</strong> {selectedEmployee?.activo ? 'Activo' : 'Inactivo'}</Typography>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInfoModal} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de editar */}
      {action === 'edit' && selectedEmployee && (
        <ModalEditar
          open={openModal}
          onClose={handleCloseModal}
          employee={selectedEmployee}
          onUpdate={handleUpdateEmployee}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={handleCancelDelete}
        aria-labelledby="confirm-delete-title"
      >
        <DialogTitle id="confirm-delete-title">¿Eliminar empleado?</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar al empleado <strong>{selectedEmployee?.name}</strong>? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="inherit">Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* Alerta de edición */}
      <Snackbar
        open={showAlertEdit}
        autoHideDuration={3000}
        onClose={() => setShowAlertEdit(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowAlertEdit(false)} severity="success" sx={{ width: '100%' }}>
          ¡Empleado editado correctamente!
        </Alert>
      </Snackbar>

      {/* Alerta de eliminación */}
      <Snackbar
        open={showAlertDelete}
        autoHideDuration={3000}
        onClose={() => setShowAlertDelete(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowAlertDelete(false)} severity="success" sx={{ width: '100%' }}>
          ¡Empleado eliminado correctamente!
        </Alert>
      </Snackbar>

    </div>
  );
};

export default EmployeeList;
