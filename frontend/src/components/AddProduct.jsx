    import React, { useState } from 'react';
    import {
    TextField,
    Button,
    Grid,
    Typography,
    Paper,
    Container,
    Snackbar,
    Alert,
    IconButton
    } from '@mui/material';
    import { Close } from '@mui/icons-material';
    import { useNavigate } from 'react-router-dom';
    import axios from 'axios';

    const AddProduct = () => {
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: '',
        price: '',
        stock: '',
        category: ''
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        await axios.post('http://localhost:5000/api/products', product, config); // ← RUTA CORRECTA
        setSuccessMessage('✅ Producto agregado correctamente');
        setProduct({ name: '', price: '', stock: '', category: '' });
        } catch (err) {
        setErrorMessage('❌ Error al agregar el producto');
        console.error(err.response?.data || err.message); // Para depurar errores
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, position: 'relative' }}>
            <IconButton
            sx={{ position: 'absolute', top: 10, right: 10, color: 'gray' }}
            onClick={() => navigate('/admin-dashboard/products')}
            >
            <Close />
            </IconButton>

            <Typography variant="h5" fontWeight="bold" color="primary" align="center" gutterBottom>
            Agregar Producto
            </Typography>

            <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                <TextField
                    label="Nombre del Producto"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
                </Grid>

                <Grid item xs={12} sm={6}>
                <TextField
                    label="Precio (S/.)"
                    name="price"
                    type="number"
                    inputProps={{ step: '0.01', min: 0 }}
                    value={product.price}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
                </Grid>

                <Grid item xs={12} sm={6}>
                <TextField
                    label="Stock"
                    name="stock"
                    type="number"
                    inputProps={{ min: 0 }}
                    value={product.stock}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
                </Grid>

                <Grid item xs={12}>
                <TextField
                    label="Categoría"
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    placeholder="Ej. Electrónica, Ropa, Hogar..."
                    sx={{ mb: 2 }}
                />
                </Grid>

                <Grid item xs={12}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ py: 1.5, fontWeight: 'bold', fontSize: '16px' }}
                >
                    Guardar Producto
                </Button>
                </Grid>
            </Grid>
            </form>
        </Paper>

        {/* Snackbar para mostrar mensaje de éxito */}
        <Snackbar open={!!successMessage} autoHideDuration={4000} onClose={() => setSuccessMessage('')}>
            <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
            {successMessage}
            </Alert>
        </Snackbar>

        {/* Snackbar para mostrar mensaje de error */}
        <Snackbar open={!!errorMessage} autoHideDuration={4000} onClose={() => setErrorMessage('')}>
            <Alert onClose={() => setErrorMessage('')} severity="error" sx={{ width: '100%' }}>
            {errorMessage}
            </Alert>
        </Snackbar>
        </Container>
    );
    };

    export default AddProduct;
    // Asegúrate de que la ruta de la API sea correcta y que el backend esté corriendo