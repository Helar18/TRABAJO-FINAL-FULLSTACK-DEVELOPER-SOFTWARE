import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
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
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { Close, Edit } from '@mui/icons-material';
import { getCompanyInfo, updateCompanyInfo } from '../services/api';

const CompanyInfo = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editedCompany, setEditedCompany] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const loadCompanyInfo = async () => {
    try {
      setLoading(true);
      const data = await getCompanyInfo();
      setCompany(data);
    } catch (error) {
      console.error('Error cargando la información de la empresa:', error);
      showSnackbar('Error al cargar los datos de la empresa', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanyInfo();
  }, []);

  const handleCloseTable = () => {
    setShowTable(false);
    navigate('/dashboard');
  };

  const handleEdit = () => {
    if (company) {
      setEditedCompany({ ...company });
      setOpenEditModal(true);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    const { nombre, ruc, direccion, telefono, email, representante } = editedCompany;

    if (!nombre || !ruc || !direccion || !telefono || !email || !representante) {
      showSnackbar('Todos los campos son obligatorios', 'warning');
      return;
    }

    try {
      setLoading(true);
      // Asegurándonos de pasar el id para la actualización
      const updated = await updateCompanyInfo(company.id, editedCompany);
      setCompany(updated);
      setOpenEditModal(false);
      showSnackbar('Empresa actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar la empresa:', error);
      showSnackbar('Error al actualizar la empresa', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Typography variant="h4" align="center" sx={{ margin: '20px 0' }}>
        Información de la Empresa
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
        showTable && company && (
          <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>RUC</TableCell>
                  <TableCell>Dirección</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Representante</TableCell>
                  <TableCell>Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{company.nombre}</TableCell>
                  <TableCell>{company.ruc}</TableCell>
                  <TableCell>{company.direccion}</TableCell>
                  <TableCell>{company.telefono}</TableCell>
                  <TableCell>{company.email}</TableCell>
                  <TableCell>{company.representante}</TableCell>
                  <TableCell>
                    <IconButton onClick={handleEdit} sx={{ color: 'blue' }}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}

      {/* Modal de edición */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Editar Empresa</DialogTitle>
        <DialogContent>
          {['nombre', 'ruc', 'direccion', 'telefono', 'email', 'representante'].map((field) => (
            <TextField
              key={field}
              margin="dense"
              name={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              fullWidth
              value={editedCompany[field] || ''}
              onChange={handleEditChange}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de alertas */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}  // ⏱️ Se cierra después de 3 segundos
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}  // 📍 Posición: abajo a la derecha
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </div>
  );
};

export default CompanyInfo;