    import React, { useEffect, useState } from 'react';
    import { TablePagination } from '@mui/material';

    import {
    Box,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    } from '@mui/material';
    import { Search, Close } from '@mui/icons-material';
    import { getProducts } from '../services/api';
    import { useNavigate } from 'react-router-dom';

    const EmployeeProductList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Cargar los productos desde la API
    const loadProducts = async () => {
        try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);
        } catch (error) {
        console.error('Error cargando los productos:', error);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // Filtrar productos por búsqueda
    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        const filtered = products.filter(
        (product) =>
            product.name.toLowerCase().includes(term.toLowerCase()) ||
            product.category.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredProducts(filtered);
        setPage(0);  // Resetear la página al buscar
    };

    // Cambiar de página en la tabla
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Cambiar el número de filas por página
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Cerrar la tabla y redirigir a otra página
    const handleCloseTable = () => {
        navigate('/employee-dashboard');  // Redirige al dashboard del empleado
    };

    return (
        <div>
        <Typography variant="h4" align="center" sx={{ margin: '20px 0' }}>
            Lista de Productos
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} px={2}>
            <TextField
            variant="outlined"
            placeholder="Buscar por nombre o categoría"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
                startAdornment: (
                <InputAdornment position="start">
                    <Search />
                </InputAdornment>
                ),
            }}
            />
            <IconButton onClick={handleCloseTable} sx={{ color: 'gray' }}>
            <Close />
            </IconButton>
        </Box>

        {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
            </Box>
        ) : (
            <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
            <Table>
                <TableHead>
                <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell>Precio</TableCell>
                    <TableCell>Stock</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {filteredProducts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((product) => (
                    <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>

            <TablePagination
                component="div"
                count={filteredProducts.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 15]}
                labelRowsPerPage="Filas por página:"
            />
            </TableContainer>
        )}
        </div>
    );
    };

    export default EmployeeProductList;
    // Compare this snippet from frontend/src/components/SidebarEmployee.jsx: