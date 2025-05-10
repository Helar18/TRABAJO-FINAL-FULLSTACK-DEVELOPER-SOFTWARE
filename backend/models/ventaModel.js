const db = require('../config/db');

// Obtener todas las ventas con los detalles de los productos
exports.getAllVentas = async () => {
  const query = `
    SELECT 
      v.id AS venta_id, v.empleado_id, v.cliente_nombre, v.cliente_dni, v.metodo_pago,
      v.total, v.monto_pago, v.vuelto, v.fecha,
      p.id AS producto_id, p.name AS producto_nombre,
      dv.cantidad, dv.precio_unitario, dv.subtotal
    FROM ventas v
    LEFT JOIN detalle_venta dv ON v.id = dv.venta_id
    LEFT JOIN products p ON dv.producto_id = p.id
    ORDER BY v.id DESC;
  `;

  const [rows] = await db.execute(query);
  return rows;
};

// Obtener ventas por empleado
exports.getVentasByEmpleado = async (empleadoId) => {
  const query = `
    SELECT 
      v.id AS venta_id, v.empleado_id, v.cliente_nombre, v.cliente_dni, v.metodo_pago,
      v.total, v.monto_pago, v.vuelto, v.fecha,
      p.id AS producto_id, p.name AS producto_nombre,
      dv.cantidad, dv.precio_unitario, dv.subtotal
    FROM ventas v
    LEFT JOIN detalle_venta dv ON v.id = dv.venta_id
    LEFT JOIN products p ON dv.producto_id = p.id
    WHERE v.empleado_id = ?
    ORDER BY v.id DESC;
  `;

  const [rows] = await db.execute(query, [empleadoId]);
  return rows;
};

// Registrar una venta en la base de datos
exports.registrarVenta = async (venta) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Insertar la venta en la tabla 'ventas'
    const [result] = await conn.execute(
      `INSERT INTO ventas 
        (empleado_id, cliente_nombre, cliente_dni, total, monto_pago, vuelto, metodo_pago)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, 

      [
        venta.empleado_id,
        venta.cliente_nombre || '---',
        venta.cliente_dni || '---',
        venta.total,
        venta.monto_pago,
        venta.vuelto,
        venta.metodo_pago
      ]
    );

    const ventaId = result.insertId;

    // Insertar los productos en la tabla 'detalle_venta' y actualizar el stock
    for (const item of venta.detalles) {
      await conn.execute(
        `INSERT INTO detalle_venta 
          (venta_id, producto_id, cantidad, precio_unitario, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [ventaId, item.producto_id, item.cantidad, item.precio_unitario, item.subtotal]
      );
    }

    // Confirmar la transacción si todo sale bien
    await conn.commit();

    return ventaId;
  } catch (error) {
    // En caso de error, revertimos todos los cambios realizados en la transacción
    await conn.rollback();
    throw new Error(`Error al registrar la venta: ${error.message}`);
  } finally {
    conn.release();
  }
};
