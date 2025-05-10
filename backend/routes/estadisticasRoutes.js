const express = require('express');
const router = express.Router();

const {
  obtenerEstadisticasPorEmpleado,
  obtenerEstadisticasPorDia,
  obtenerEstadisticasPorSemana,
  obtenerEstadisticasPorMes
} = require('../controllers/estadisticasController');

router.get('/', obtenerEstadisticasPorEmpleado);
router.get('/dia', obtenerEstadisticasPorDia);
router.get('/semana', obtenerEstadisticasPorSemana);
router.get('/mes', obtenerEstadisticasPorMes);

module.exports = router;
