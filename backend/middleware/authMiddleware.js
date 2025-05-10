const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verificar si el encabezado existe y tiene el formato correcto
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Token no proporcionado o mal formado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Añadir datos del usuario al request
    next(); // Continuar con la siguiente función middleware o ruta
  } catch (err) {
    console.error('❌ Error al verificar token:', err.message);

    return res.status(401).json({
      message:
        err.name === 'TokenExpiredError'
          ? 'Token expirado'
          : 'Token inválido'
    });
  }
};

module.exports = { verifyToken };
