const db = require('../config/db');

const obtenerEstadisticasPorEmpleado = async (req, res) => {
  try {
    const query = `
      SELECT e.id AS empleado_id, e.name AS empleado_name, 
             COUNT(v.id) AS total_ventas, SUM(v.total) AS total_monto
      FROM empleados e
      LEFT JOIN ventas v ON e.id = v.empleado_id
      GROUP BY e.id
      ORDER BY total_ventas DESC;
    `;
    const [rows] = await db.execute(query);
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas por empleado' });
  }
};

const obtenerEstadisticasPorDia = async (req, res) => {
  try {
    const query = `
      SELECT e.id AS empleado_id, e.name AS empleado_name, 
             DATE(v.fecha) AS fecha, 
             COUNT(v.id) AS total_ventas, 
             SUM(v.total) AS total_monto
      FROM empleados e
      LEFT JOIN ventas v ON e.id = v.empleado_id
      GROUP BY e.id, fecha
      ORDER BY fecha DESC, total_ventas DESC;
    `;
    const [rows] = await db.execute(query);
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas por día' });
  }
};

const obtenerEstadisticasPorSemana = async (req, res) => {
  try {
    const query = `
      SELECT e.id AS empleado_id, e.name AS empleado_name, 
             YEAR(v.fecha) AS año, WEEK(v.fecha, 1) AS semana,
             COUNT(v.id) AS total_ventas, SUM(v.total) AS total_monto
      FROM empleados e
      LEFT JOIN ventas v ON e.id = v.empleado_id
      GROUP BY e.id, año, semana
      ORDER BY año DESC, semana DESC, total_ventas DESC;
    `;
    const [rows] = await db.execute(query);
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas por semana' });
  }
};

const obtenerEstadisticasPorMes = async (req, res) => {
  try {
    const query = `
      SELECT e.id AS empleado_id, e.name AS empleado_name, 
             YEAR(v.fecha) AS año, MONTH(v.fecha) AS mes, 
             COUNT(v.id) AS total_ventas, SUM(v.total) AS total_monto
      FROM empleados e
      LEFT JOIN ventas v ON e.id = v.empleado_id
      GROUP BY e.id, año, mes
      ORDER BY año DESC, mes DESC, total_ventas DESC;
    `;
    const [rows] = await db.execute(query);
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas por mes' });
  }
};

module.exports = {
  obtenerEstadisticasPorEmpleado,
  obtenerEstadisticasPorDia,
  obtenerEstadisticasPorSemana,
  obtenerEstadisticasPorMes,
};
