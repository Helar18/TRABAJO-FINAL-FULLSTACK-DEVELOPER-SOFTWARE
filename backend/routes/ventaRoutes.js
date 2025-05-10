const express = require('express');
const router = express.Router();
const { registrarVenta, getVentas } = require('../controllers/ventaController');
const { verifyToken } = require('../middleware/authMiddleware');

// Añadir esta línea:
router.get('/historial', getVentas);

router.get('/', getVentas);
router.post('/', verifyToken, registrarVenta); 

module.exports = router;
