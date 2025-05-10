// empresa-ventas/backend/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

// Cargar variables de entorno desde .env
dotenv.config();

// Configurar middlewares
app.use(cors()); // Permite solicitudes de otros dominios
app.use(express.json()); // Permite recibir cuerpos JSON en las peticiones

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const companyRoutes = require('./routes/companyRoutes');
const productRoutes = require('./routes/productRoutes');
const ventaRoutes = require('./routes/ventaRoutes'); // Ruta para ventas
const empleadoVentaRoutes = require('./routes/empleadoVentaRoutes'); // Ruta para ventas específicas de empleados
const estadisticasRoutes = require('./routes/estadisticasRoutes'); // Ruta para estadísticas de ventas

// Rutas base de la API
app.use('/api/auth', authRoutes); // Ruta de autenticación
app.use('/api/employees', employeeRoutes); // Ruta de empleados
app.use('/api/company', companyRoutes); // Ruta de empresa
app.use('/api/products', productRoutes); // Ruta de productos
app.use('/api/ventas', ventaRoutes); // Ruta para ventas
app.use('/api/ventas/empleado', empleadoVentaRoutes); // Ruta para ventas de empleados
app.use('/api/estadisticas', estadisticasRoutes); // Ruta para estadísticas de ventas

// Manejo de errores 404
// Si una ruta no es encontrada, el servidor devolverá un mensaje de error 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000; // Utiliza el puerto de las variables de entorno, si está disponible
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
