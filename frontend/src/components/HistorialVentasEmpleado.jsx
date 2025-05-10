    import React, { useEffect, useState } from 'react';
    import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Button,
    IconButton,
    Tooltip,
    Snackbar,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    } from '@mui/material';
    import { Close, Info } from '@mui/icons-material';
    import { useNavigate } from 'react-router-dom';

    const HistorialVentasEmpleado = () => {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTable, setShowTable] = useState(true); // Para controlar si mostramos la tabla
    const [showAlertDelete, setShowAlertDelete] = useState(false); // Alerta cuando se elimina una venta
    const [selectedVenta, setSelectedVenta] = useState(null); // Venta seleccionada para ver detalles
    const navigate = useNavigate();

    const loadVentas = async () => {
        try {
        const empleadoId = sessionStorage.getItem('userId');
        if (!empleadoId) throw new Error('No se encontró el ID del empleado en la sesión');

        const response = await fetch(`http://localhost:5000/api/ventas/empleado/${empleadoId}`);
        if (!response.ok) throw new Error('Error al obtener ventas');

        const data = await response.json();
        if (Array.isArray(data)) {
            setVentas(data);
        } else {
            throw new Error('La respuesta de la API no es válida');
        }
        } catch (error) {
        console.error('Error al cargar ventas:', error);
        setError(error.message);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        loadVentas();
    }, []);

    const handleCloseTable = () => {
        setShowTable(false);
        navigate('/dashboard');
    };

    const handleOpenInfoModal = (venta) => {
        setSelectedVenta(venta);
    };

    const handleCloseInfoModal = () => {
        setSelectedVenta(null);
    };

    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-PE');
    };

    // Aquí corregimos la función renderProductos
    const renderProductos = () => {
        if (!selectedVenta?.productos || selectedVenta.productos.length === 0) {
        return (
            <TableRow>
            <TableCell colSpan={4} align="center">
                <Typography variant="body1" color="error">
                No hay productos para mostrar.
                </Typography>
            </TableCell>
            </TableRow>
        );
        }

        return selectedVenta.productos.map((producto, index) => (
        <TableRow key={index}>
            <TableCell>{producto.producto_nombre}</TableCell> {/* Usar producto_nombre en lugar de nombre */}
            <TableCell>{producto.cantidad}</TableCell>
            <TableCell>S/ {parseFloat(producto.precio_unitario).toFixed(2)}</TableCell>
            <TableCell>S/ {parseFloat(producto.subtotal).toFixed(2)}</TableCell>
        </TableRow>
        ));
    };

    return (
        <div>
        <Typography variant="h4" align="center" sx={{ margin: '20px 0' }}>
            Historial de Ventas
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
                <TableHead sx={{ backgroundColor: '#14B8A6' }}>
                    <TableRow>
                    <TableCell sx={{ color: 'white' }}>ID</TableCell>
                    <TableCell sx={{ color: 'white' }}>Fecha</TableCell>
                    <TableCell sx={{ color: 'white' }}>Cliente</TableCell>
                    <TableCell sx={{ color: 'white' }}>DNI</TableCell>
                    <TableCell sx={{ color: 'white' }}>Total</TableCell>
                    <TableCell sx={{ color: 'white' }}>Método de Pago</TableCell>
                    <TableCell sx={{ color: 'white' }}>Pagado</TableCell>
                    <TableCell sx={{ color: 'white' }}>Vuelto</TableCell>
                    <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {ventas.map((venta) => (
                    <TableRow key={venta.venta_id}>
                        <TableCell>{venta.venta_id}</TableCell>
                        <TableCell>{formatFecha(venta.fecha)}</TableCell>
                        <TableCell>{venta.cliente_nombre}</TableCell>
                        <TableCell>{venta.cliente_dni}</TableCell>
                        <TableCell>S/ {parseFloat(venta.total).toFixed(2)}</TableCell>
                        <TableCell>{venta.metodo_pago}</TableCell>
                        <TableCell>S/ {parseFloat(venta.monto_pago).toFixed(2)}</TableCell>
                        <TableCell>S/ {parseFloat(venta.vuelto).toFixed(2)}</TableCell>
                        <TableCell>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleOpenInfoModal(venta)}
                        >
                            <Info sx={{ marginRight: 1 }} />
                            Ver Detalles
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                    {ventas.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={9} align="center">
                        No hay ventas registradas.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </TableContainer>
            )
        )}

        {/* Modal de más información */}
        <Dialog open={!!selectedVenta} onClose={handleCloseInfoModal} maxWidth="md" fullWidth>
            <DialogTitle>Más Información de la Venta</DialogTitle>
            <DialogContent>
            <Box sx={{ marginBottom: 2 }}>
                <Typography variant="h6" color="primary" sx={{ marginBottom: 2 }}>
                Detalles de la Venta
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />
                <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                    <strong>Cliente:</strong> {selectedVenta?.cliente_nombre}
                    </Typography>
                    <Typography variant="body1">
                    <strong>DNI:</strong> {selectedVenta?.cliente_dni}
                    </Typography>
                    <Typography variant="body1">
                    <strong>Fecha:</strong> {formatFecha(selectedVenta?.fecha)}
                    </Typography>
                    <Typography variant="body1">
                    <strong>Método de Pago:</strong> {selectedVenta?.metodo_pago}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                    <strong>Total:</strong> S/. {parseFloat(selectedVenta?.total).toFixed(2)}
                    </Typography>
                    <Typography variant="body1">
                    <strong>Pagado:</strong> S/. {parseFloat(selectedVenta?.monto_pago).toFixed(2)}
                    </Typography>
                    <Typography variant="body1">
                    <strong>Vuelto:</strong> S/. {parseFloat(selectedVenta?.vuelto).toFixed(2)}
                    </Typography>
                </Grid>
                </Grid>
            </Box>

            {/* Tabla de productos en el modal */}
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                <TableHead sx={{ backgroundColor: '#14B8A6' }}>
                    <TableRow>
                    <TableCell sx={{ color: 'white' }}>Producto</TableCell>
                    <TableCell sx={{ color: 'white' }}>Cantidad</TableCell>
                    <TableCell sx={{ color: 'white' }}>Precio Unitario</TableCell>
                    <TableCell sx={{ color: 'white' }}>Subtotal</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {renderProductos()} {/* Llamar a la función renderProductos aquí */}
                </TableBody>
                </Table>
            </TableContainer>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleCloseInfoModal} color="primary">
                Cerrar
            </Button>
            </DialogActions>
        </Dialog>

        {/* Alerta de eliminación */}
        <Snackbar
            open={showAlertDelete}
            autoHideDuration={3000}
            onClose={() => setShowAlertDelete(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert onClose={() => setShowAlertDelete(false)} severity="success" sx={{ width: '100%' }}>
            ¡Venta eliminada correctamente!
            </Alert>
        </Snackbar>
        </div>
    );
    };

    export default HistorialVentasEmpleado;
