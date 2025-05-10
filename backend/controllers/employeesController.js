const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.addEmployee = async (req, res) => {
  const {
    name, email, dni, fecha_nacimiento, fecha_ingreso,
    telefono, direccion, rol, salario, historial_trabajo,
    password, activo = true, created_at, foto_perfil = ''
  } = req.body;

  if (!name || !email || !dni || !fecha_nacimiento || !fecha_ingreso || !telefono ||
      !direccion || !rol || !salario || !password || !created_at) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  try {
    const [existing] = await db.query(
      'SELECT * FROM empleados WHERE email = ? OR dni = ?',
      [email, dni]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Ya existe un empleado con ese email o DNI' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO empleados 
       (name, email, password, dni, fecha_nacimiento, fecha_ingreso, telefono, direccion, 
        foto_perfil, rol, salario, historial_trabajo, activo, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, email, hashedPassword, dni, fecha_nacimiento, fecha_ingreso,
        telefono, direccion, foto_perfil, rol, parseFloat(salario),
        historial_trabajo, activo, created_at
      ]
    );

    res.status(201).json({ message: 'Empleado agregado', id: result.insertId });
  } catch (error) {
    console.error('Error al agregar empleado:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const [employees] = await db.query('SELECT * FROM empleados');
    res.status(200).json({ employees });
  } catch (err) {
    console.error('Error al obtener empleados:', err);
    res.status(500).json({ message: 'Error al obtener empleados' });
  }
};

exports.editEmployee = async (req, res) => {
  const { id } = req.params;
  const {
    name, email, dni, fecha_nacimiento, fecha_ingreso,
    telefono, direccion, rol, salario, historial_trabajo,
    activo = true, foto_perfil = ''
  } = req.body;

  // Validar que los campos necesarios estén presentes
  if (!name || !email || !dni || !fecha_nacimiento || !fecha_ingreso ||
      !telefono || !direccion || !rol || !salario || !historial_trabajo) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  try {
    // Verificar si el empleado existe
    const [existingEmployee] = await db.query('SELECT * FROM empleados WHERE id = ?', [id]);

    if (existingEmployee.length === 0) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    // Realizar la actualización
    const [result] = await db.query(
      `UPDATE empleados SET 
        name = ?, email = ?, dni = ?, fecha_nacimiento = ?, fecha_ingreso = ?, 
        telefono = ?, direccion = ?, foto_perfil = ?, rol = ?, salario = ?, 
        historial_trabajo = ?, activo = ? WHERE id = ?`,
      [
        name, email, dni, fecha_nacimiento, fecha_ingreso, telefono, direccion, 
        foto_perfil, rol, parseFloat(salario), historial_trabajo, activo, id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    res.status(200).json({ message: 'Empleado actualizado' });
  } catch (err) {
    console.error('Error al editar empleado:', err);
    res.status(500).json({ message: 'Error al editar empleado' });
  }
};


exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    // Aquí, usa `db.query` directamente con `async/await` en lugar de `db.promise().query()`
    const [result] = await db.query('DELETE FROM empleados WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }
    res.status(200).json({ message: 'Empleado eliminado' });
  } catch (err) {
    console.error('Error al eliminar:', err);
    res.status(500).json({ message: 'Error al eliminar empleado' });
  }
};
