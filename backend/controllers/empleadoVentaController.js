// backend/controllers/empleadoVentaController.js
const db = require('../config/db');

const getVentasByEmpleado = async (req, res) => {
  const empleadoId = parseInt(req.params.id);

  if (isNaN(empleadoId)) {
    return res.status(400).json({ message: 'El ID del empleado no es válido.' });
  }

  const query = `
    SELECT 
      v.id AS venta_id, v.cliente_nombre, v.cliente_dni, v.metodo_pago, 
      v.total, v.monto_pago, v.vuelto, v.fecha,
      p.id AS producto_id, p.name AS producto_nombre,
      dv.cantidad, dv.precio_unitario, dv.subtotal
    FROM ventas v
    JOIN detalle_venta dv ON v.id = dv.venta_id
    JOIN products p ON dv.producto_id = p.id
    WHERE v.empleado_id = ?
    ORDER BY v.id;
  `;

  try {
    const [rows] = await db.execute(query, [empleadoId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron ventas para este empleado.' });
    }

    // Agrupar ventas con productos
    const ventasMap = new Map();

    rows.forEach(row => {
      const ventaId = row.venta_id;

      if (!ventasMap.has(ventaId)) {
        ventasMap.set(ventaId, {
          venta_id: ventaId,
          cliente_nombre: row.cliente_nombre,
          cliente_dni: row.cliente_dni,
          metodo_pago: row.metodo_pago,
          total: row.total,
          monto_pago: row.monto_pago,
          vuelto: row.vuelto,
          fecha: row.fecha,
          productos: []
        });
      }

      ventasMap.get(ventaId).productos.push({
        producto_id: row.producto_id,
        producto_nombre: row.producto_nombre,
        cantidad: row.cantidad,
        precio_unitario: row.precio_unitario,
        subtotal: row.subtotal
      });
    });

    // Convertimos el Map a un array
    const ventasOrganizadas = Array.from(ventasMap.values());

    res.status(200).json(ventasOrganizadas);
  } catch (error) {
    console.error('❌ Error al obtener las ventas del empleado:', error);
    res.status(500).json({ message: 'Error al obtener las ventas del empleado', error });
  }
};

module.exports = {
  getVentasByEmpleado,
};
