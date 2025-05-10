const ventaModel = require('../models/ventaModel');

// Obtener todas las ventas con productos agrupados
const getVentas = async (req, res) => {
  try {
    const rows = await ventaModel.getAllVentas();

    if (!rows.length) {
      return res.status(404).json({ message: 'No hay ventas registradas.' });
    }

    // Agrupar las ventas por ID y asociarles los productos
    const ventasMap = new Map();

    rows.forEach(row => {
      const ventaId = row.venta_id;

      if (!ventasMap.has(ventaId)) {
        ventasMap.set(ventaId, {
          venta_id: ventaId,
          empleado_id: row.empleado_id,
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

      if (row.producto_id) {
        ventasMap.get(ventaId).productos.push({
          producto_id: row.producto_id,
          producto_nombre: row.producto_nombre,
          cantidad: row.cantidad,
          precio_unitario: row.precio_unitario,
          subtotal: row.subtotal
        });
      }
    });

    const ventasOrganizadas = Array.from(ventasMap.values());

    res.status(200).json(ventasOrganizadas);
  } catch (error) {
    console.error('❌ Error al obtener ventas:', error);
    res.status(500).json({ message: 'Error al obtener ventas', error });
  }
};

// Registrar una nueva venta
const registrarVenta = async (req, res) => {
  try {
    const { cliente, productos, total, pago, metodoPago, vuelto } = req.body;
    const empleado_id = req.user?.userId;

    console.log('Datos recibidos en req.body:', req.body);
    console.log('User:', req.user);
    console.log('ID del empleado autenticado:', empleado_id);

    // Validación de campos obligatorios
    if (
      !cliente || !cliente.nombre || !cliente.dni ||
      !Array.isArray(productos) || productos.length === 0 ||
      total == null || pago == null || !metodoPago || empleado_id == null
    ) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Validar cada producto (debe tener id, cantidad y precio)
    for (let producto of productos) {
      if (!producto.id || !producto.cantidad || !producto.precio) {
        return res.status(400).json({ error: 'Todos los productos deben tener id, cantidad y precio' });
      }
      if (producto.cantidad <= 0 || producto.precio <= 0) {
        return res.status(400).json({ error: 'La cantidad y el precio de los productos deben ser mayores a 0' });
      }
    }

    // Calcular el vuelto si no se pasa
    const vueltoCalculado = vuelto || (pago - total);
    
    // Si el vuelto es negativo, mostrar error
    if (vueltoCalculado < 0) {
      return res.status(400).json({ error: 'El monto de pago es insuficiente para cubrir el total' });
    }

    // Crear el objeto de la venta
    const venta = {
      empleado_id,
      cliente_nombre: cliente.nombre,
      cliente_dni: cliente.dni,
      total,
      monto_pago: pago,
      vuelto: vueltoCalculado,
      metodo_pago: metodoPago,
      detalles: productos.map(p => ({
        producto_id: p.id,
        cantidad: p.cantidad,
        precio_unitario: p.precio,
        subtotal: p.cantidad * p.precio
      }))
    };

    // Registrar la venta en la base de datos
    const ventaId = await ventaModel.registrarVenta(venta);

    res.status(201).json({ message: 'Venta registrada exitosamente', ventaId });
  } catch (error) {
    console.error('❌ Error al registrar la venta:', error);
    res.status(500).json({ error: 'Error al registrar la venta' });
  }
};

module.exports = {
  registrarVenta,
  getVentas
};
