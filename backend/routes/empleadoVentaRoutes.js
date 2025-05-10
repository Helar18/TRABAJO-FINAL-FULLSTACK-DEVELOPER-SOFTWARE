const express = require('express');
const router = express.Router();
const { getVentasByEmpleado } = require('../controllers/empleadoVentaController');

// Ruta para obtener ventas por empleado (usando el id del empleado y el parámetro de periodo)
router.get('/:id', getVentasByEmpleado);

module.exports = router;
