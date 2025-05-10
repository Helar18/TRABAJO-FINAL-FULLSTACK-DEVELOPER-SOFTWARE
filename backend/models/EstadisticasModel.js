const db = require('../config/db'); // Importa la conexión a la base de datos

const obtenerEstadisticasPorEmpleado = async () => {
  try {
    console.log('Iniciando consulta de estadísticas por empleado...');  // Depuración inicial

    const query = `
      SELECT e.id AS empleado_id, e.name AS empleado_name, 
             COUNT(v.id) AS total_ventas, SUM(v.total) AS total_monto
      FROM empleados e
      LEFT JOIN ventas v ON e.id = v.empleado_id
      GROUP BY e.id
      ORDER BY total_ventas DESC;
    `;
    
    console.log('Ejecutando consulta: ', query); // Depuración para ver la consulta ejecutada

    const [rows] = await db.execute(query);  // Realiza la consulta a la base de datos
    
    if (rows.length === 0) {
      console.log('No se encontraron ventas para ningún empleado');  // Si no hay datos, lo indica
    } else {
      console.log('Resultados de la consulta:', rows);  // Verifica qué resultados está devolviendo la consulta
    }

    return rows;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error); // Manejo de errores
    throw error;
  }
};

module.exports = {
  obtenerEstadisticasPorEmpleado,
};
