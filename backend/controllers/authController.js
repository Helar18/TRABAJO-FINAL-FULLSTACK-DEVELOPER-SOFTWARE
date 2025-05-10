const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db');

exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  // Validar campos requeridos
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  // Validar rol permitido
  if (!['admin', 'employee'].includes(role)) {
    return res.status(400).json({ message: 'Rol inválido' });
  }

  const table = role === 'admin' ? 'admins' : 'empleados';

  try {
    const [rows] = await db.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = rows[0];

    // Validar si el empleado está activo (solo si es empleado)
    if (role === 'employee' && user.activo === 0) {
      return res.status(403).json({ message: 'Empleado inactivo' });
    }

    // Comparar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Enviar token + info básica del usuario (necesario para frontend)
    res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
      },
    });
  } catch (err) {
    console.error('❌ Error en login:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
