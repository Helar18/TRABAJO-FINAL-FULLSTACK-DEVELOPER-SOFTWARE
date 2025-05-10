import React, { useState, useEffect } from 'react';
import {
    Box, Grid, TextField, Typography, Button, Snackbar, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, IconButton, Select, MenuItem
} from '@mui/material';
import { Close } from '@mui/icons-material';
import Boleta from './Boleta';
import VentaExitosaModal from './VentaExitosaModal';
import { useNavigate } from 'react-router-dom';
import { registrarVenta, getProducts } from '../services/api';

const RealizarVenta = () => {
    const navigate = useNavigate();

    const [productos, setProductos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [cliente, setCliente] = useState({ nombre: '', dni: '' });
    const [pago, setPago] = useState('');
    const [metodoPago, setMetodoPago] = useState('Efectivo');
    const [modalVenta, setModalVenta] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    // Obtener los productos al cargar la página
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await getProducts();
                setProductos(data);
            } catch (error) {
                console.error('Error al obtener productos:', error);
                setAlertMessage('No se pudieron cargar los productos');
            }
        };
        fetchProductos();
    }, []);

    // Agregar producto a la lista de seleccionados
    const agregarProducto = (producto) => {
        setProductosSeleccionados(prevSeleccionados => {
            const yaExiste = prevSeleccionados.find(p => p.id === producto.id);
            if (yaExiste) {
                return prevSeleccionados.map(p =>
                    p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
                );
            } else {
                return [...prevSeleccionados, { ...producto, cantidad: 1 }];
            }
        });
    };

    // Eliminar producto de la lista de seleccionados
    const eliminarProducto = (id) => {
        setProductosSeleccionados(prevSeleccionados =>
            prevSeleccionados.filter(p => p.id !== id)
        );
    };

    // Calcular el total de la venta
    const totalVenta = productosSeleccionados.reduce((acc, p) => {
        const precio = p.price && !isNaN(p.price) ? parseFloat(p.price) : 0;
        const cantidad = p.cantidad && !isNaN(p.cantidad) ? p.cantidad : 0;
        return acc + (precio * cantidad);
    }, 0);

    // Calcular el vuelto
    const vuelto = pago ? parseFloat(pago) - totalVenta : 0;

    const confirmarVenta = async () => {
        // Verificar si los datos están completos antes de enviarlos
        if (!cliente.nombre || !cliente.dni) {
            return setAlertMessage('Completa los datos del cliente');
        }
        if (productosSeleccionados.length === 0) {
            return setAlertMessage('Agrega al menos un producto');
        }
        if (!pago || parseFloat(pago) < totalVenta) {
            return setAlertMessage('El monto de pago no es suficiente');
        }
    
        // Imprimir los datos que se enviarán
        /*console.log('Datos de la venta:', {
            cliente: {
                nombre: cliente.nombre,
                dni: cliente.dni,
            },
            productos: productosSeleccionados.map(p => ({
                producto_id: p.id,
                cantidad: p.cantidad,
                precio_unitario: parseFloat(p.price),
                subtotal: parseFloat(p.price) * p.cantidad
            })),
            total: totalVenta,
            pago: parseFloat(pago),
            vuelto: vuelto,
            metodoPago: metodoPago
        });*/
    
        const venta = {
            cliente: {
                nombre: cliente.nombre,
                dni: cliente.dni,
            },
            productos: productosSeleccionados.map(p => ({
                producto_id: p.id,
                cantidad: p.cantidad,
                precio_unitario: parseFloat(p.price),
                subtotal: parseFloat(p.price) * p.cantidad
            })),
            total: totalVenta,
            pago: parseFloat(pago),
            vuelto: vuelto,
            metodoPago: metodoPago
        };
    
        try {
            await registrarVenta(venta);
            setModalVenta(true);
        } catch (error) {
            console.error('Error al registrar venta:', error);
            setAlertMessage('Error al registrar la venta');
        }
    };
    

    // Cerrar el modal de venta exitosa
    const handleModalClose = () => {
        setCliente({ nombre: '', dni: '' });
        setProductosSeleccionados([]);
        setPago('');
        setMetodoPago('Efectivo');
        setSearchQuery('');
        setModalVenta(false);
    };

    // Filtrar productos por búsqueda
    const productosFiltrados = searchQuery
        ? productos.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.toString().includes(searchQuery) ||
            p.price.toString().includes(searchQuery)
        )
        : productos;

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
                <Box sx={{
                    padding: 3,
                    backgroundColor: '#fff',
                    borderRadius: 3,
                    boxShadow: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid #e0e0e0'
                }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#14B8A6' }}>
                            Datos del Cliente
                        </Typography>
                        <IconButton onClick={() => navigate('/employee-dashboard')}>
                            <Close />
                        </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <TextField
                            label="Nombre"
                            fullWidth
                            variant="outlined"
                            value={cliente.nombre}
                            onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
                        />
                        <TextField
                            label="DNI"
                            fullWidth
                            variant="outlined"
                            value={cliente.dni}
                            onChange={(e) => setCliente({ ...cliente, dni: e.target.value })}
                        />
                    </Box>

                    <TextField
                        label="Buscar Producto por ID, Nombre o Precio"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 3 }}
                    />

                    {searchQuery && productosFiltrados.length === 0 && (
                        <Typography variant="body2" color="error">
                            Producto no encontrado
                        </Typography>
                    )}

                    {searchQuery && productosFiltrados.length > 0 && (
                        <TableContainer component={Paper} sx={{ mb: 3 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Producto</TableCell>
                                        <TableCell>Precio</TableCell>
                                        <TableCell>Agregar</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {productosFiltrados.map(p => (
                                        <TableRow key={p.id}>
                                            <TableCell>{p.name}</TableCell>
                                            <TableCell>S/.{!isNaN(p.price) ? parseFloat(p.price).toFixed(2) : '0.00'}</TableCell>
                                            <TableCell>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    onClick={() => agregarProducto(p)}
                                                    sx={{
                                                        backgroundColor: '#14B8A6',
                                                        '&:hover': { backgroundColor: '#0b9c91' },
                                                        transition: 'background-color 0.3s ease',
                                                    }}
                                                >
                                                    +
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#14B8A6' }}>
                        Productos Seleccionados
                    </Typography>
                    <TableContainer component={Paper} sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Producto</TableCell>
                                    <TableCell>Cant.</TableCell>
                                    <TableCell>Subtotal</TableCell>
                                    <TableCell>Eliminar</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productosSeleccionados.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell>{p.name}</TableCell>
                                        <TableCell>{p.cantidad}</TableCell>
                                        <TableCell>S/.{(p.price * p.cantidad).toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Button size="small" color="error" onClick={() => eliminarProducto(p.id)}>
                                                X
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h6">Total a Pagar:</Typography>
                        <Typography variant="h6" color="green">
                            S/. {totalVenta.toFixed(2)}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <TextField
                            label="Monto Pago"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={pago}
                            onChange={(e) => setPago(e.target.value)}
                        />
                        <Select
                            value={metodoPago}
                            onChange={(e) => setMetodoPago(e.target.value)}
                            displayEmpty
                            fullWidth
                            variant="outlined"
                        >
                            <MenuItem value="" disabled>
                                Elegir método de pago
                            </MenuItem>
                            <MenuItem value="Efectivo">Efectivo</MenuItem>
                            <MenuItem value="Tarjeta">Tarjeta</MenuItem>
                            <MenuItem value="Transferencia">Transferencia</MenuItem>
                        </Select>
                    </Box>

                    <Typography sx={{ mb: 2 }}>Vuelto: S/.{(vuelto && !isNaN(vuelto) ? vuelto.toFixed(2) : '0.00')}</Typography>

                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#14B8A6',
                            color: '#fff',
                            '&:hover': { backgroundColor: '#0b9c91' },
                            transition: 'background-color 0.3s ease',
                        }}
                        onClick={confirmarVenta}
                    >
                        Confirmar Venta
                    </Button>
                </Box>
            </Grid>

            <Grid item xs={12} md={5}>
                <Box sx={{
                    padding: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 3,
                    boxShadow: 3,
                    marginLeft: '100px',
                    backgroundColor: '#fafafa'
                }}>
                    <Boleta
                        cliente={cliente.nombre || '---'}
                        dni={cliente.dni || '---'}
                        productos={productosSeleccionados}
                        totalVenta={totalVenta}
                        montoPago={parseFloat(pago) || 0}
                        metodoPago={metodoPago}
                        vuelto={vuelto}
                    />
                    <VentaExitosaModal open={modalVenta} onClose={handleModalClose} />
                </Box>
            </Grid>

            <Snackbar
                open={alertMessage !== ''}
                message={alertMessage}
                autoHideDuration={3000}
                onClose={() => setAlertMessage('')}
            />
        </Grid>
    );
};

export default RealizarVenta;
